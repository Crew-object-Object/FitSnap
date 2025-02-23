import { TopThree } from "@/components/top-three";
import { StyleLeaderboard } from "@/components/style-leaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/lib/prisma";

export default async function LeaderboardPage() {
  // Fetch fits data along with the count of swipes, then derive leaderboard data from it
  const fits = await prisma.fit.findMany({
    include: {
      _count: {
        select: { swipes: true },
      },
      user: true,
    },
  });

  // Map each fit to a leaderboard item with a score derived from the swipe count
  const leaders = fits
    .map((fit) => ({
      ...fit,
      score: fit._count.swipes,
    }))
    .sort((a, b) => b.score - a.score);

  // Derive top three leaders and group remaining data by style category
  const topThree = leaders.slice(0, 3);
  const winners = topThree.map((leader, index) => {
    let color = "";
    if (index === 0) color = "bg-yellow-400"; // Gold
    if (index === 1) color = "bg-gray-300"; // Silver
    if (index === 2) color = "bg-amber-700"; // Bronze

    return {
      position: index + 1,
      name: leader.user?.name || "Anonymous",
      points: leader.score.toString(),
      avatar: leader.user?.image || "/placeholder.svg",
      color,
    };
  });

  const categories = ["Oversized", "Formal", "Casual", "Gothic"];
  const styleData: { [key: string]: typeof leaders } = {};
  categories.forEach((category) => {
    styleData[category] = leaders.filter((item) =>
      item.tags.includes(category)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>

      <TopThree winners={winners} />

      {/* Style Categories with Tabs */}
      <Tabs defaultValue="Oversized" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <StyleLeaderboard category={category} data={styleData[category]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
