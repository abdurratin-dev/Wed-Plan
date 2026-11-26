"use client";

import { updateService } from "@/lib/actions/api/service";
import { cn } from "@/lib/utils";
import { ServiceData } from "@/types/apidata";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Briefcase, ChevronDown, CloudUpload, LayoutGrid, MapPin, Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, LOCATIONS } from "./BrowseServices";
import { toast } from "../ui/toast";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type FieldName = "name" | "category" | "price" | "location" | "image";
type Errors = Partial<Record<FieldName, string>>;

const labelClass =
  "block text-[0.78rem] font-semibold text-[#4a3a41] dark:text-[#d5c1ca]";

const fieldClass =
  "w-full rounded-xl border bg-white px-4 py-3 pl-10 text-sm text-[#2b0713] outline-none transition placeholder:text-[#a89a9f] focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:bg-[#241720] dark:text-white dark:placeholder:text-[#8d7a84] dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15 dark:[color-scheme:dark]";

const invalidClass = "border-[#d6455f] focus:border-[#d6455f] focus:ring-[#d6455f]/20";
const validClass = "border-[#eee2dd] dark:border-white/10";

interface IProps {
  service: ServiceData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful save so the parent can refresh its data. */
  onSaved?: () => void;
}

function EditServiceForm({
  service,
  onOpenChange,
  onSaved,
}: Omit<IProps, "open">) {
  const [name, setName] = useState(service.name);
  const [category, setCategory] = useState(service.category);
  const [price, setPrice] = useState(
    (service.price ?? "").replace(/^\s*৳\s*/, "").trim(),
  );
  const [location, setLocation] = useState(service.location);
  const [status, setStatus] = useState<ServiceData["status"]>(service.status);
  const [description, setDescription] = useState(service.description ?? "");
  const [imageUrl, setImageUrl] = useState(service.imageUrl ?? "");
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // Release the object URL when the preview is swapped out or we unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    try {
      const formData = new FormData();
      formData.append("image", file);
      const imageBB = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`;
      const uploadRes = await fetch(imageBB, { method: "POST", body: formData });
      const result = await uploadRes.json();
      setImageUrl(result.data.url);
      clearError("image");
    } catch {
      setImageError("Upload failed, please try again");
    }
  }

  function removeImage() {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setImageUrl("");
    setImageError(null);
    clearError("image");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    if (name.trim().length < 3) next.name = "Please enter a service name";
    if (!category) next.category = "Please choose a category";
    if (!price.trim()) next.price = "Please enter a price";
    if (!location.trim()) next.location = "Please choose a location";
    if (!imageUrl.trim()) next.image = "Please keep or upload a service image";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    setSaveError(null);
    try {
      const dataupdate = await updateService({
        id: service._id,
        name: name.trim(),
        category,
        description: description.trim(),
        price: price.trim(),
        location,
        imageUrl,
        status,
      });
      onSaved?.();
      onOpenChange(false);
      console.log(dataupdate);
    } catch {
      setSaveError("Could not save your changes. Please try again.");
    } finally {
      toast.add({
        type: "success",
        description : `${name} service updated`
      })
      setSaving(false);
    }
  }

  const errorText = (message?: string) =>
    message ? (
      <p className="mt-1.5 text-xs font-medium text-[#d6455f] dark:text-[#ff8fa3]">{message}</p>
    ) : null;

  const categoryOptions = CATEGORIES.some((item) => item.value === category)
    ? CATEGORIES
    : [...CATEGORIES, { label: category, value: category, isActive: false }];

  const locationOptions = LOCATIONS.includes(location)
    ? LOCATIONS
    : [...LOCATIONS, location];

  return (
    <form noValidate onSubmit={handleSubmit}>
          {/* ---------- Header ---------- */}
          <div className="flex items-start gap-3.5 px-6 pt-6 pb-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#720e32] text-white shadow-[0_12px_24px_-14px_rgba(114,14,50,0.9)] dark:bg-[#a52b50]">
              <Briefcase className="size-6" />
            </span>
            <div className="min-w-0 pr-6">
              <DialogTitle className="text-2xl leading-tight font-extrabold tracking-tight text-[#720e32] dark:text-[#ff9bb9]">
                Edit Service
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-[#7a6a71] dark:text-[#c8b3bd]">
                Update service details and manage information
              </DialogDescription>
            </div>
          </div>

          {/* ---------- Body ---------- */}
          <div className="px-6 pb-6">
            <section className="rounded-2xl border border-[#f6dbe6] bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
              <h3 className="flex items-center gap-2 text-[0.95rem] font-extrabold text-[#720e32] dark:text-[#ff9bb9]">
                <Pencil className="size-4" />
                Service Information
              </h3>

              <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                {/* Service name */}
                <div>
                  <label htmlFor="edit-service-name" className={labelClass}>
                    Service Name{" "}
                    <span className="text-[#d6455f] dark:text-[#ff8fa3]">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <Briefcase className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#a52b50] dark:text-[#ff9bb9]" />
                    <input
                      id="edit-service-name"
                      type="text"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError("name");
                      }}
                      aria-invalid={!!errors.name}
                      className={cn(
                        fieldClass,
                        errors.name ? invalidClass : validClass,
                      )}
                    />
                  </div>
                  {errorText(errors.name)}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="edit-service-category" className={labelClass}>
                    Category <span className="text-[#d6455f] dark:text-[#ff8fa3]">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <LayoutGrid className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#a52b50] dark:text-[#ff9bb9]" />
                    <select
                      id="edit-service-category"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        clearError("category");
                      }}
                      aria-invalid={!!errors.category}
                      className={cn(
                        fieldClass,
                        "appearance-none pr-10",
                        errors.category ? invalidClass : validClass,
                      )}
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#6b7280] dark:text-[#b3a3ab]" />
                  </div>
                  {errorText(errors.category)}
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="edit-service-price" className={labelClass}>
                    Price <span className="text-[#d6455f] dark:text-[#ff8fa3]">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-bold text-[#a52b50] dark:text-[#ff9bb9]">
                      ৳
                    </span>
                    <input
                      id="edit-service-price"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        clearError("price");
                      }}
                      aria-invalid={!!errors.price}
                      className={cn(
                        fieldClass,
                        "pl-8",
                        errors.price ? invalidClass : validClass,
                      )}
                    />
                  </div>
                  {errorText(errors.price)}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="edit-service-location" className={labelClass}>
                    Location <span className="text-[#d6455f] dark:text-[#ff8fa3]">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#a52b50] dark:text-[#ff9bb9]" />
                    <select
                      id="edit-service-location"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        clearError("location");
                      }}
                      aria-invalid={!!errors.location}
                      className={cn(
                        fieldClass,
                        "appearance-none pr-10",
                        errors.location ? invalidClass : validClass,
                      )}
                    >
                      <option value="">Select a location</option>
                      {locationOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#6b7280] dark:text-[#b3a3ab]" />
                  </div>
                  {errorText(errors.location)}
                </div>
              </div>

              {/* Status */}
              <div className="mt-4">
                <p className={labelClass}>Status</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-full bg-[#f9e2ec] p-1.5 dark:bg-white/10">
                  {(["Active", "Inactive"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={status === value}
                      onClick={() => setStatus(value)}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition focus-visible:ring-2 focus-visible:outline-none",
                        status === value
                          ? "bg-[#720e32] text-white shadow-sm focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50]"
                          : "text-[#8a5a68] hover:bg-white/70 focus-visible:ring-[#720e32]/30 dark:text-[#c8b3bd] dark:hover:bg-white/10",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2 rounded-full",
                          value === "Active" ? "bg-[#22c55e]" : "bg-[#ef4444]",
                        )}
                      />
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label
                  htmlFor="edit-service-description"
                  className={labelClass}
                >
                  Description
                </label>
                <textarea
                  id="edit-service-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your service, what is included, and why couples will love it..."
                  className="mt-1.5 w-full resize-y rounded-xl border border-[#eee2dd] bg-white px-4 py-3 text-sm leading-relaxed text-[#2b0713] outline-none transition placeholder:text-[#a89a9f] focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:border-white/10 dark:bg-[#241720] dark:text-white dark:placeholder:text-[#8d7a84] dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15"
                />
              </div>

              {/* Service image */}
              <div className="mt-4">
                <p className={labelClass}>Service Image</p>

                <input
                  id="edit-service-image"
                  ref={fileRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = "";
                  }}
                />

                <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
                  {(preview || imageUrl) && (
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-[#f1ded7] bg-[#f3e9e5] sm:w-32 dark:border-white/10 dark:bg-[#2b1b25]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- preview of an uploaded/remote image */}
                      <img
                        src={preview ?? imageUrl}
                        alt="Service image preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        aria-label="Remove image"
                        className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )}

                  <label
                    htmlFor="edit-service-image"
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
                      "flex min-h-[112px] flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-4 text-center transition focus-visible:ring-2 focus-visible:outline-none",
                      dragging
                        ? "border-[#720e32] bg-[#fdf1eb] focus-visible:ring-[#720e32]/40 dark:border-[#ff9bb9] dark:bg-[#2f1e28]"
                        : "border-[#e8d5cd] bg-[#fdfbfa] hover:border-[#720e32]/50 hover:bg-[#fdf5f2] focus-visible:ring-[#720e32]/30 dark:border-white/15 dark:bg-[#241720] dark:hover:border-[#ff9bb9]/50 dark:hover:bg-[#2b1b25]",
                    )}
                  >
                    <CloudUpload
                      className="size-7 text-[#720e32] dark:text-[#ff9bb9]"
                      strokeWidth={1.8}
                    />
                    <span className="text-[0.8rem] font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-[0.7rem] text-[#a89a9f] dark:text-[#8d7a84]">
                      PNG, JPG or WEBP (Max 5MB)
                    </span>
                  </label>
                </div>
                {errorText(errors.image)}
                {imageError && (
                  <p className="mt-1.5 text-xs font-medium text-[#d6455f] dark:text-[#ff8fa3]">
                    {imageError}
                  </p>
                )}
              </div>
            </section>

            {/* ---------- Footer ---------- */}
            {saveError && (
              <p className="mt-3 rounded-xl border border-[#f3c9c9] bg-[#fdecec] px-4 py-2.5 text-xs font-medium text-[#b91c1c] dark:border-[#dc2626]/40 dark:bg-[#dc2626]/10 dark:text-[#f87171]">
                {saveError}
              </p>
            )}

            <div className="mt-4 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center rounded-xl border border-[#e3c3bd] bg-white px-5 py-3 text-sm font-bold text-[#720e32] transition hover:bg-[#fdf1eb] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/15 dark:bg-transparent dark:text-[#ff9bb9] dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#720e32] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
    </form>
  );
}

export default function EditServiceDialog({
  service,
  open,
  onOpenChange,
  onSaved,
}: IProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(90vh,860px)] gap-0 overflow-y-auto rounded-2xl bg-[#fdeef3] p-0 shadow-[0_40px_90px_-45px_rgba(114,14,50,0.6)] ring-[#f6d9e4] sm:max-w-xl dark:bg-[#241720] dark:ring-white/10"
      >
        {open && (
          <EditServiceForm
            service={service}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
