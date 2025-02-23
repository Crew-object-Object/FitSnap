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
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">Top {category} Models</h2>
      <div className="space-y-3">
        {models.map((model, index) => (
          <Card key={model.name} className="p-3">
            <div className="flex items-center gap-2">
              <div className="font-bold text-base w-6">{index + 1}</div>
              <Avatar className="w-10 h-10 border-2 border-primary">
                <AvatarImage src={model.avatar} />
                <AvatarFallback>{model.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <h3 className="font-semibold text-sm truncate">
                    {model.name}
                  </h3>
                  {model.trending && (
                    <Badge
                      variant="secondary"
                      className="gap-1 text-xs py-0 h-5"
                    >
                      <Flame className="w-3 h-3" /> Trending
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {model.points} points
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="gap-1 text-xs py-0 h-5">
                  <Crown className="w-3 h-3" />
                  {model.streak}d
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
