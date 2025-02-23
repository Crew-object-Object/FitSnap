"use server";

import { UTApi } from "uploadthing/server";

interface Result1 {
  predicted_size: string[];
}

interface Result2 {
  pants_fit: string;
  shirt_fit: string;
  pants_size: string;
  result_url: string;
  shirt_size: string;
}

const utapi = new UTApi();

export async function DetectionAction(
  formData: FormData
): Promise<{ result1: Result1; result2?: Result2 }> {
  const age = formData.get("age");
  const height = formData.get("height");
  const weight = formData.get("weight");
  const fit_url = formData.get("file_url");
  const fileImage = formData.get("fileImage");

  if (!age || !height || !weight) {
    throw new Error("Missing required fields");
  }

  const response1 = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/predict-size-metrics`,
    {
      method: "POST",
      body: JSON.stringify({
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response1.ok) {
    throw new Error(`Failed to fetch size prediction: ${response1.statusText}`);
  }

  let result2: Result2 | undefined = undefined;
  const result1: Result1 = await response1.json();

  if (fit_url) {
    const url = await utapi.uploadFiles([fileImage as File]);

    if (!url || !url[0]?.data?.ufsUrl) {
      throw new Error("Failed to upload file");
    }

    const response2 = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/predict-size`,
      {
        method: "POST",
        body: JSON.stringify({
          fit_url,
          user_url: url[0].data.ufsUrl,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response2.ok) {
      throw new Error(
        `Failed to fetch fit prediction: ${response2.statusText}`
      );
    }

    result2 = await response2.json();
  }

  return { result1, ...(result2 && { result2 }) };
}
