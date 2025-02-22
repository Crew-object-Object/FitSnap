import SwipeCards from "@/components/image-swipe";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const data = await prisma.fit.findMany({
    where: {
      userId: {
        not: user?.user.id,
      },
    },
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <SwipeCards props={data} />
    </div>
  );
}
