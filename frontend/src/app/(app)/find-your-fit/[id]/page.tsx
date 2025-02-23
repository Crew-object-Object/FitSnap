import { Suspense } from "react";
import prisma from "@/lib/prisma";
import FindYourFit from "@/components/find-your-fit";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fitData = await prisma.fit.findFirst({
    where: { id },
  });

  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FindYourFit id={id} fitData={fitData} />
      </Suspense>
    </main>
  );
}
