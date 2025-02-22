import SwipeCards from "@/components/image-swipe";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  let data = await prisma.fit.findMany({
    where: {
      userId: {
        not: user?.session.id,
      },
    },
    include: {
      swipes: {
        where: {
          swipeType: "Like",
        },
      },
      _count: {
        select: {
          swipes: {
            where: {
              swipeType: "Like",
            },
          },
        },
      },
    },
    orderBy: {
      swipes: {
        _count: "desc",
      },
    },
  });

  data = data.sort((a, b) => b._count.swipes - a._count.swipes);

  return (
    <div className="w-full h-full">
      <SwipeCards props={data} />
    </div>
  );
}
