import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "32MB",
    },
  })
    .middleware(async () => {
      try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session || !session.user) {
          throw new UploadThingError("Unauthorized: No active session found.");
        }

        return { userId: session.user.id };
      } catch (error) {
        console.error("UploadThing Middleware Error:", error);
        throw new UploadThingError("Failed to authenticate user.");
      }
    })
    .onUploadComplete(async ({ file }) => {
      try {
        if (!file.ufsUrl) {
          throw new UploadThingError("Upload failed: No file URL returned.");
        }

        return { image: file.ufsUrl };
      } catch (error) {
        console.error("UploadThing Upload Error:", error);
        throw new UploadThingError("Upload processing failed.");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
