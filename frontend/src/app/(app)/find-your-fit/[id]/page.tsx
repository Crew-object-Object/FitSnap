import { Suspense } from "react";
import FindYourFit from "@/components/find-your-fit";

export default function Page() {
  const id = "cm7gi14ul0002sbivlu5q0l38";

  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FindYourFit id={id} />
      </Suspense>
    </main>
  );
}
