"use server";

import prisma from "@/lib/prisma";

export async function createFit(formData: FormData) {
  try {
    const image = formData.get("image") as string;
    const userId = formData.get("userId") as string;
    const tags =
      (formData.get("tags") as string)?.split(",").map((t) => t.trim()) || [];
    const description = formData.get("description") as string;

    if (!userId || !image || !description) {
      return { success: false, error: "All fields except tags are required" };
    }

    const fit = await prisma.fit.create({
      data: {
        userId,
        image,
        tags,
        description,
      },
    });

    return { success: true, fit };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
