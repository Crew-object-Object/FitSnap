"use server";

export async function DetectionAction(formData: FormData) {
  const age = formData.get("age");
  const height = formData.get("height");
  const weight = formData.get("weight");
  const file = formData.get("file");

  const fit_url = formData.get("fileUrl");

  const fileImage = JSON.parse(file as string);
  const response1 = await fetch(
    "https://senate-evans-exempt-identify.trycloudflare.com/predict-size-metrics",
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

  const response2 = await fetch(
    "https://senate-evans-exempt-identify.trycloudflare.com/predict-size",
    {
      method: "POST",
      body: JSON.stringify({
        fit_url,
        file: fileImage,
      }),
    }
  );
  console.log(await response1.json());
  console.log(await response2.json());
}
