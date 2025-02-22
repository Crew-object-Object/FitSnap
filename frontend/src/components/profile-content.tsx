import Image from "next/image";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function ProfileContent() {
  const data = await prisma.user.findMany({
    where: {
      Swipe: {
        some: {},
      },
    },
    orderBy: {
      Swipe: {
        _count: "desc",
      },
    },
  });

  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = user?.user.id;

  const userRank = data.findIndex((user) => user.id === userId) + 1;

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="max-w-md mx-auto mb-12">
        <div className="bg-teal-400 text-white text-center py-3 rounded-lg text-lg font-medium">
          {`Rank: ${userRank}`}
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
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="aspect-square bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt={`Recent post ${i}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Saved Posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Saved Posts</h2>
            <Button variant="ghost" className="text-muted-foreground">
              more
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="aspect-square bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt={`Saved post ${i}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Most Liked Posts */}
        <section className="pb-12">
          <h2 className="text-xl font-semibold mb-4">Most Liked Posts</h2>
          <Card className="aspect-square w-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <Image
                src="/placeholder.svg"
                alt="Most liked post"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-rose-400 w-12 h-12 rounded-full" />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
