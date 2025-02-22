import { Suspense } from "react";
import FindYourFit from "@/components/find-your-fit";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FindYourFit id={id} />
      </Suspense>
    </main>
  );
}
