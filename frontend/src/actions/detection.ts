"use server";

import { UTApi, UTFile } from "uploadthing/server";

interface Result {
  predicted_size: string[];
}

const utapi = new UTApi();

export async function DetectionAction(formData: FormData): Promise<Result> {
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

  const url = await utapi.uploadFiles([fileImage as File]);

  const response2 = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/predict-size`,
    {
      method: "POST",
      body: JSON.stringify({
        fit_url,
        user_url: url[0].data?.ufsUrl!,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(await response2.json());

  const data: Result = await response1.json();
  return data;
}
