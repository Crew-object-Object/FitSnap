import { Suspense } from "react";
import FindYourFit from "@/components/find-your-fit";

export default async function Page() {
  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FindYourFit />
      </Suspense>
    </main>
  );
}
