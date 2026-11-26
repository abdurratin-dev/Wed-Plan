"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, CloudUpload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createService } from "@/lib/actions/api/service";
import { CreateServicePayload } from "@/types/apidata";
import { CATEGORIES, LOCATIONS } from "../services/BrowseServices";
import { authClient } from "@/lib/auth-client";
import { email } from "better-auth";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const MAX_DESCRIPTION = 500;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type FieldName =
  | "name"
  | "category"
  | "description"
  | "price"
  | "location"
  | "image";
type Errors = Partial<Record<FieldName, string>>;

type PickedImage = File;

const labelClass =
  "block text-[0.8rem] font-semibold text-[#4a3a41] dark:text-[#d5c1ca]";

const fieldClass = (invalid?: string) =>
  cn(
    "w-full rounded-xl border bg-[#fdfbfa] px-4 py-3.5 text-sm text-[#2b0713] outline-none transition placeholder:text-[#a89a9f] focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:bg-[#241720] dark:text-white dark:placeholder:text-[#8d7a84] dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15 dark:[color-scheme:dark]",
    invalid
      ? "border-[#d6455f] focus:border-[#d6455f] focus:ring-[#d6455f]/20"
      : "border-[#eee2dd] dark:border-white/10",
  );

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AddServiceForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fileRef = useRef<HTMLInputElement>(null);

  const { data: session, error } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const clearError = (field: FieldName) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  async function handleFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError("Please upload a JPG, PNG or WEBP image");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be smaller than 5MB");
      return;
    }
    setImageError(null);
    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);
    const imageBB = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`;

    const uploadImage = await fetch(imageBB, {
      method: "POST",
      body: formData,
    });
    const result = await uploadImage.json();

    setImageUrl(result.data.url);
  }

  function removeImage() {
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setImageError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleReset() {
    setName("");
    setCategory("");
    setDescription("");
    setPrice("");
    setLocation("");
    setErrors({});
    removeImage();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const next: Errors = {};
    if (name.trim().length < 3) next.name = "Please enter a service name";
    if (!category) next.category = "Please choose a category";
    if (description.trim().length < 20)
      next.description = "Please write at least 20 characters";
    if (!price.trim() || Number(price) <= 0)
      next.price = "Please enter a valid price";
    if (location.trim().length < 2) next.location = "Please enter a location";
    if (!imageUrl.trim()) next.image = "Please upload your service photo";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setSubmitted(false);
      return;
    }

    // UI-only for now — nothing is persisted until the backend is wired up.
    const data: CreateServicePayload = {
      name,
      category,
      description,
      price,
      location,
      imageUrl,
      status: "Active",
      vendorId: user?.id,
      vendorName: user?.name,
      email: user?.email,
    };
    try {
      const postService = await createService(data);
      if (postService.status) {
        return router.push("/unauthorized");
      }
      setSubmitted(true);
      handleReset();
    } catch {
      setSubmitted(false);
      toast.add({
        type : "error",
        description : "Your service not added Try Again"
      })
    } finally {
      setLoading(false);
      toast.add({
        type : "secces",
        description : "Youer service added"
      })
    }
  }

  const errorText = (message?: string) =>
    message ? (
      <p className="mt-1.5 text-xs font-medium text-[#d6455f] dark:text-[#ff8fa3]">
        {message}
      </p>
    ) : null;

  return (
    <div className="px-4 pb-12 pt-3 sm:px-6 lg:px-10 lg:pt-5">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page heading */}
        <header className="mb-6 lg:mb-8">
          <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#720e32] dark:text-[#ff9bb9]">
            <span
              aria-hidden="true"
              className="h-px w-8 bg-[#720e32]/40 dark:bg-[#ff9bb9]/40"
            />
            Add New Service
          </p>
          <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[#2b0713] sm:text-4xl dark:text-[#ffeaf1]">
            Add Your Service
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
            Tell couples what you offer. Fill in the details below and your
            listing will appear on the WedPlan marketplace.
          </p>
        </header>

        {/* Form card */}
        <section className="rounded-3xl border border-[#f1ded7] bg-white p-5 shadow-[0_30px_60px_-35px_rgba(114,14,50,0.4)] sm:p-7 dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
          <form
            noValidate
            onSubmit={handleSubmit}
            className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10"
          >
            {/* Left column — fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="service-name" className={labelClass}>
                  Service Name
                </label>
                <input
                  id="service-name"
                  name="serviceName"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Premium Wedding Photography"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  aria-invalid={!!errors.name}
                  className={cn(fieldClass(errors.name), "mt-1.5")}
                />
                {errorText(errors.name)}
              </div>

              <div>
                <label htmlFor="service-category" className={labelClass}>
                  Service Category
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="service-category"
                    name="serviceCategory"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      clearError("category");
                    }}
                    aria-invalid={!!errors.category}
                    className={cn(
                      fieldClass(errors.category),
                      "appearance-none pr-11",
                      !category && "text-[#a89a9f] dark:text-[#8d7a84]",
                    )}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#a89a9f] dark:text-[#8d7a84]"
                  />
                </div>
                {errorText(errors.category)}
              </div>

              <div>
                <label htmlFor="service-description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="service-description"
                  name="description"
                  rows={5}
                  maxLength={MAX_DESCRIPTION}
                  placeholder="Describe your service, what is included, and why couples will love it..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    clearError("description");
                  }}
                  aria-invalid={!!errors.description}
                  className={cn(
                    fieldClass(errors.description),
                    "mt-1.5 resize-y leading-relaxed",
                  )}
                />
                <div className="mt-1.5 flex items-start justify-between gap-3">
                  {errors.description ? (
                    <p className="text-xs font-medium text-[#d6455f] dark:text-[#ff8fa3]">
                      {errors.description}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span
                    className={cn(
                      "shrink-0 text-xs tabular-nums",
                      description.length >= MAX_DESCRIPTION
                        ? "font-semibold text-[#d6455f] dark:text-[#ff8fa3]"
                        : "text-[#a89a9f] dark:text-[#8d7a84]",
                    )}
                  >
                    {description.length}/{MAX_DESCRIPTION}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="service-price" className={labelClass}>
                    Price
                  </label>
                  <input
                    id="service-price"
                    name="price"
                    type="number"
                    min={0}
                    step="any"
                    inputMode="decimal"
                    placeholder="e.g. 25000"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      clearError("price");
                    }}
                    aria-invalid={!!errors.price}
                    className={cn(
                      fieldClass(errors.price),
                      "mt-1.5 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]",
                    )}
                  />
                  {errorText(errors.price)}
                </div>

                <div>
                  <label htmlFor="service-location" className={labelClass}>
                    Location
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="service-location"
                      name="serviceLocation"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        clearError("location");
                      }}
                      aria-invalid={!!errors.location}
                      className={cn(
                        fieldClass(errors.location),
                        "appearance-none pr-11",
                        !category && "text-[#a89a9f] dark:text-[#8d7a84]",
                      )}
                    >
                      <option value="">Select your location</option>
                      {LOCATIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#a89a9f] dark:text-[#8d7a84]"
                    />
                  </div>
                  {errorText(errors.location)}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {loading ? (
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-[#720e32] px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                    >
                       <Spinner className="size-6" /> <span className="px-2">
                        Add Service
                        </span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-[#720e32] px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                    >
                      Add Service
                    </button>
                  )}
                </div>

                {submitted && (
                  <p className="mt-4 rounded-xl border border-[#e3c3bd] bg-[#fdf1eb] px-4 py-3 text-xs font-medium leading-relaxed text-[#720e32] dark:border-[#a52b50]/40 dark:bg-[#2f1e28] dark:text-[#ffb0c5]">
                    Looks good — your service has been added.
                  </p>
                )}
              </div>
            </div>

            {/* Right column — image upload */}
            <div>
              <p className={labelClass}>Service Image</p>

              <input
                id="service-image"
                ref={fileRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="sr-only peer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = "";
                }}
              />

              {!image ? (
                <label
                  htmlFor="service-image"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node))
                      setDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                  }}
                  className={cn(
                    "mt-1.5 flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#720e32]/40 peer-focus-visible:outline-none",
                    dragging
                      ? "border-[#720e32] bg-[#fdf1eb] dark:border-[#ff9bb9] dark:bg-[#2f1e28]"
                      : "border-[#e8d5cd] bg-[#fdfbfa] hover:border-[#720e32]/50 hover:bg-[#fdf5f2] dark:border-white/15 dark:bg-[#241720] dark:hover:border-[#ff9bb9]/50 dark:hover:bg-[#2b1b25]",
                  )}
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#720e32]/10 text-[#720e32] dark:bg-[#ff9bb9]/10 dark:text-[#ff9bb9]">
                    <CloudUpload size={26} strokeWidth={1.8} />
                  </span>
                  <span className="mt-3 text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                    Upload Service Image
                  </span>
                  <span className="text-xs text-[#6b5a61] dark:text-[#c8b3bd]">
                    Drag &amp; drop or{" "}
                    <span className="font-bold text-[#720e32] dark:text-[#ff9bb9]">
                      browse
                    </span>
                  </span>
                  <span className="mt-3 text-[0.7rem] font-medium tracking-wider text-[#a89a9f] uppercase dark:text-[#8d7a84]">
                    JPG, PNG, WEBP • Max 5MB
                  </span>
                  {errorText(errors.image)}
                </label>
              ) : (
                <div className="mt-1.5 rounded-2xl border border-[#f1ded7] bg-[#fdfbfa] p-2.5 dark:border-white/10 dark:bg-[#241720]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f3e9e5] dark:bg-[#2b1b25]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- preview of a local blob URL */}
                    <img
                      src={image}
                      alt="Service image preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      aria-label="Remove image"
                      className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="shrink-0 text-xs font-bold text-[#720e32] transition hover:underline dark:text-[#ff9bb9]"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              )}

              {imageError && (
                <p className="mt-2 text-xs font-medium text-[#d6455f] dark:text-[#ff8fa3]">
                  {imageError}
                </p>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
