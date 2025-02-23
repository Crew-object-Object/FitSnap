"use server";

interface Result {
  predicted_size: string[];
}

export async function DetectionAction(formData: FormData): Promise<Result> {
  const age = formData.get("age");
  const height = formData.get("height");
  const weight = formData.get("weight");

  if (!age || !height || !weight) {
    throw new Error("Missing required fields");
  }

  const response = await fetch(
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

  if (!response.ok) {
    throw new Error(`Failed to fetch size prediction: ${response.statusText}`);
  }

  // const response2 = await fetch(
  //   "https://senate-evans-exempt-identify.trycloudflare.com/predict-size",
  //   {
  //     method: "POST",
  //     body: JSON.stringify({
  //       fit_url,
  //       file: fileImage,
  //     }),
  //   }
  // );

  const data: Result = await response.json();
  return data;
}
