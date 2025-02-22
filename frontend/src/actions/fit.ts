"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createFit(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;
  const rawTags = formData.get("tags") as string;
  const image = (formData.get("image") as string) || "aaa";
  const description = formData.get("description") as string;

  if (!userId || !image || !description) {
    throw new Error("All fields except tags are required.");
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(rawTags);
    if (!Array.isArray(tags)) throw new Error();
  } catch {
    tags = rawTags?.split(",").map((t) => t.trim()) || [];
  }

  const fit = await prisma.fit.create({
    data: {
      tags,
      image,
      userId,
      description,
    },
  });

  return fit;
}
