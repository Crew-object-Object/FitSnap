import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Flame } from "lucide-react";

interface StyleLeaderboardProps {
  category: string;
}

export function StyleLeaderboard({ category }: StyleLeaderboardProps) {
  // Mock data - replace with real data
  const models = [
    {
      name: "Alex Style",
      avatar: "/placeholder.svg",
      points: "2,450",
      streak: 7,
      trending: true,
    },
    {
      name: "Jordan Fashion",
      avatar: "/placeholder.svg",
      points: "2,280",
      streak: 5,
      trending: false,
    },
    {
      name: "Taylor Trend",
      avatar: "/placeholder.svg",
      points: "2,150",
      streak: 3,
      trending: true,
    },
    {
      name: "Casey Chic",
      avatar: "/placeholder.svg",
      points: "1,990",
      streak: 4,
      trending: false,
    },
    {
      name: "Riley Runway",
      avatar: "/placeholder.svg",
      points: "1,820",
      streak: 2,
      trending: true,
    },
  ];

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-6">Top {category} Models</h2>
      <div className="space-y-4">
        {models.map((model, index) => (
          <Card key={model.name} className="p-4">
            <div className="flex items-center gap-4">
              <div className="font-bold text-lg w-8">{index + 1}</div>
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarImage src={model.avatar} />
                <AvatarFallback>{model.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{model.name}</h3>
                  {model.trending && (
                    <Badge variant="secondary" className="gap-1">
                      <Flame className="w-3 h-3" /> Trending
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {model.points} points
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Crown className="w-3 h-3" />
                  {model.streak} day streak
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
