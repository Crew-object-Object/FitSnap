import { Suspense } from "react";
import FindYourFit from "@/components/find-your-fit";

export default function Page({ params }: { params: { id?: string[] } }) {
  const id = params.id?.[0];

  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FindYourFit id={id} />
      </Suspense>
    </main>
  );
}
