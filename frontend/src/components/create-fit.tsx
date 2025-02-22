"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { Tags } from "@/components/tags";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@uploadthing/react";
import { createFit } from "@/actions/fit";
import Image from "next/image";
import { toast } from "sonner";

export function CreateFit() {
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
                  src={imageUrl}
                  alt="Uploaded Preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-300"
                  width={200}
                  height={200}
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
              <UploadDropzone
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
