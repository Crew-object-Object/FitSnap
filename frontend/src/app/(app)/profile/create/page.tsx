"use client";

import {
  generatePermittedFileTypes,
  generateClientDropzoneAccept,
} from "uploadthing/client";
import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/utils/uploadthing";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypographyH3 } from "@/components/typography/H3";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const profileSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  age: z.coerce.number().min(13, "Age must be at least 13"),
  bio: z.string().max(200, "Bio cannot exceed 200 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
        const fileUrl = res[0].url;
        setImageUrl(fileUrl);
        setValue("imageUrl", fileUrl);
        setLoading(false);
        toast.success("Image uploaded successfully!");
      },
      onUploadError: (error) => {
        setLoading(false);
        toast.error(`Upload failed: ${error.message}`);
      },
      onUploadBegin: () => {
        setLoading(true);
      },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0] || null);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
    multiple: false,
  });

  const handleUploadFile = useCallback(() => {
    if (file) {
      startUpload([file]);
    }
  }, [file, startUpload]);

  const onSubmit = (data: ProfileFormData) => {
    console.log("Profile Data:", data);
    toast.success("Profile created successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen mt-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <TypographyH3>Create Profile</TypographyH3>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input {...register("username")} placeholder="Enter username" />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message as string}
                </p>
              )}
            </div>

            <div>
              <Label>Profile Picture</Label>
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <Button type="button" className="w-full">
                  Select Image
                </Button>
              </div>

              {file && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm">{file.name}</p>
                  <Button
                    type="button"
                    disabled={loading}
                    className="w-full"
                    onClick={handleUploadFile}
                  >
                    {loading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              )}

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="mt-2 rounded-md w-24 h-24 object-cover"
                />
              )}
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                {...register("bio")}
                placeholder="Tell us about yourself"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">
                  {errors.bio.message as string}
                </p>
              )}
            </div>

            <div>
              <Label>Age</Label>
              <Input
                type="number"
                {...register("age")}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">
                  {errors.age.message as string}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
