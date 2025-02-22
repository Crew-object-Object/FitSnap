"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import {
  generatePermittedFileTypes,
  generateClientDropzoneAccept,
} from "uploadthing/client";
import type React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Tags } from "@/components/tags";
import { createFit } from "@/actions/fit";
import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from "@uploadthing/react";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/utils/uploadthing";

export function CreateFit() {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("image", imageUrl || "");
    formData.append("tags", JSON.stringify(tags));

    toast.promise(createFit(formData), {
      loading: "Creating fit...",
      success: <b>Fit created successfully!</b>,
      error: <b>Failed to create fit. Please try again.</b>,
    });
  };

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const fileUrl = res[0].appUrl;
      setImageUrl(fileUrl);
      toast.success("Image Uploaded Successfully");
    },
    onUploadError: () => {
      setUploadStatus("Upload failed");
      setLoading(false);
      toast.success("Failed To Upload Image");
    },
    onUploadBegin: () => {
      console.log("Upload has begun for", file?.name);
      setLoading(true);
      setUploadStatus(null);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0] || null);
    setUploadStatus(null);
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

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create a New Fit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            {imageUrl ? (
              <div className="relative w-full flex justify-center">
                <Image
                  width={200}
                  height={200}
                  src={imageUrl}
                  alt="Uploaded Preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-300"
                />
                <Button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-2 right-2 bg-red-500 text-foreground p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <UploadDropzone<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                appearance={{ button: "!bg-[#AB01FE]" }}
                onClientUploadComplete={(res) => {
                  setImageUrl(res[0].url);
                  console.log("Uploaded Image URL:", res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your fit..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <Tags tags={tags} setTags={setTags} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Post Fit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
