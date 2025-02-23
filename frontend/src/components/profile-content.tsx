import Image from "next/image";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function ProfileContent() {
  const data = await prisma.user.findMany({
    orderBy: {
      Swipe: {
        _count: "desc",
      },
    },
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;
  const userRank = data.findIndex((user) => user.id === userId) + 1;

  const userData = await prisma.user.findUnique({
    where: { id: userId! },
    include: {
      Swipe: { include: { fit: true }, where: { swipeType: "Like" } },
      fits: { orderBy: { swipes: { _count: "desc" } } },
    },
  });

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="max-w-md mx-auto mb-12">
        <div className="bg-teal-400 text-background text-center py-3 rounded-lg">
          <span className="block text-sm">Rank</span>
          <span className="block text-3xl font-bold">
            {userRank === 0 ? "N/A" : userRank}
          </span>
        </div>
      </div>

      {/* Posts Sections */}
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Recent Posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Posts</h2>
            <Button variant="ghost" className="text-muted-foreground">
              more
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {userData!.fits.map((fit) => (
              <Card
                key={fit.id}
                className="aspect-square bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={fit.image}
                    alt={`Recent post ${fit.id}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            ))}
            {userData?.fits.length === 0 && (
              <p className="col-span-3 text-center text-muted-foreground">
                No posts yet.
              </p>
            )}
          </div>
        </section>

        {/* Saved Posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Liked Posts</h2>
            <Button variant="ghost" className="text-muted-foreground">
              more
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {userData!.Swipe.map(({ fit }) => (
              <Card
                key={fit.id}
                className="aspect-square bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={fit.image}
                    alt={`Saved post ${fit.id}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            ))}
            {userData?.Swipe.length === 0 && (
              <p className="col-span-3 text-center text-muted-foreground">
                No likes yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
