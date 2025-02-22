import { TopThree } from "@/components/top-three";
import { StyleLeaderboard } from "@/components/style-leaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold text-center mb-12">Style Leaders</h1>

      {/* Top 3 Overall */}
      <TopThree />

      {/* Style Categories */}
      <Tabs defaultValue="oversized" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="oversized">Oversized</TabsTrigger>
          <TabsTrigger value="formal">Formal</TabsTrigger>
          <TabsTrigger value="casual">Casual</TabsTrigger>
          <TabsTrigger value="gothic">Gothic</TabsTrigger>
        </TabsList>
        <TabsContent value="oversized">
          <StyleLeaderboard category="Oversized" />
        </TabsContent>
        <TabsContent value="formal">
          <StyleLeaderboard category="Formal" />
        </TabsContent>
        <TabsContent value="casual">
          <StyleLeaderboard category="Casual" />
        </TabsContent>
        <TabsContent value="gothic">
          <StyleLeaderboard category="Gothic" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
