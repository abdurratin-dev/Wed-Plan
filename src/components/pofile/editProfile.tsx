"use client";

import { useRef, useState } from "react";
import { Camera, UserRound, Upload, X, Save, ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { updateUserById } from "@/lib/actions/api/users";
import { authClient } from "@/lib/auth-client";

interface EditProfileProps {
  initialName?: string;
  initialImage?: string;
  onSave?: (data: { name: string; image: File | null }) => void;
  onCancel?: () => void;
  className: string;
}

const EditProfile = ({
  initialName = "",
  initialImage = "",
  onSave,
  onCancel,
  className,
}: EditProfileProps) => {
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [imageFile, setImageFile] = useState<File | string>("");

  const { data: session, error } = authClient.useSession();
  const user = session?.user;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Upload
  const handleImageChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    setImage("");
    setImageFile("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Save Profile
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    const imageBB = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`;

    const uploadImge = await fetch(imageBB, {
      method: "POST",
      body: formData,
    });
    const result = await uploadImge.json();

    const data = {
      name,
      image: result.data.url,
    };
    const updateUser = await updateUserById(user?.id, data);

    console.log(updateUser);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button className={className}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#fce8ef] p-2 text-[#8b2146] dark:bg-[#65122f]/40 dark:text-[#ff91b7]">
                <UserRound size={18} />
              </div>
              Edit Profile
            </div>
            <ArrowRight
              size={16}
              className="text-gray-400 transition group-hover:translate-x-1"
            />
          </button>
        }
      />
      <form>
        <DialogContent>
          <section className=" bg-[#fff9f6] px-4 py-8 transition-colors duration-300 dark:bg-[#110a0e] sm:px-6">
            <div className="mx-auto max-w-2xl">
              {/* Main Card */}
              <div className="overflow-hidden rounded-2xl border border-[#f0dedc] bg-white shadow-sm dark:border-white/10 dark:bg-[#1d111a]">
                {/* Card Banner */}
                <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#500d28] via-[#81143c] to-[#bd4774]">
                  <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5" />

                  <div className="absolute left-6 top-5 flex items-center gap-2 text-white">
                    <Camera size={19} />
                    <span className="text-sm font-bold">Profile Settings</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-8">
                  {/* Profile Image */}
                  <div className="mb-8 flex flex-col items-center">
                    <div className="relative">
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#fce8ef] shadow-md dark:border-[#1d111a] dark:bg-[#38202e]">
                        {image ? (
                          <img
                            src={image}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound
                            size={55}
                            className="text-[#9b1748] dark:text-[#ff91b7]"
                          />
                        )}
                      </div>

                      {/* Upload Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 rounded-xl border-2 border-white bg-[#720e32] p-2.5 text-white shadow-md transition hover:bg-[#941443] dark:border-[#1d111a] dark:bg-[#e52d82]"
                        aria-label="Upload profile image"
                      >
                        <Camera size={18} />
                      </button>

                      {/* Remove Image */}
                      {image && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md transition hover:bg-red-600"
                          aria-label="Remove profile image"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-bold text-[#451127] dark:text-white">
                      Profile Picture
                    </h3>

                    <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                      Upload a new profile photo (Max 5MB)
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageChange(file);
                        }
                        e.target.value = "";
                      }}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#e8cbd4] px-4 py-2 text-xs font-semibold text-[#720e32] transition hover:bg-[#fff0f4] dark:border-white/15 dark:text-[#ff91b7] dark:hover:bg-white/5"
                    >
                      <Upload size={15} />
                      Upload New Photo
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="mb-7 border-t border-[#f0e3e5] dark:border-white/10" />

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-semibold text-[#451127] dark:text-gray-200"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a33b60] dark:text-[#ff91b7]"
                      />

                      <input
                        id="fullName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        maxLength={60}
                        className="w-full rounded-xl border border-[#ead9dc] bg-[#fffaf9] py-3 pl-11 pr-4 text-sm text-[#451127] outline-none transition placeholder:text-gray-400 focus:border-[#9b1748] focus:ring-2 focus:ring-[#9b1748]/10 dark:border-white/10 dark:bg-[#130c12] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#e52d82] dark:focus:ring-[#e52d82]/10"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#f0e3e5] pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={onCancel}
                      className="rounded-xl border border-[#ead9dc] px-6 py-3 text-sm font-semibold text-[#720e32] transition hover:bg-[#fff0f4] dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#81143c] to-[#c32868] px-6 py-3 text-sm font-bold text-white shadow-md shadow-pink-900/10 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={17} />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditProfile;
