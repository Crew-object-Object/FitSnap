import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

interface StyleLeaderboardProps {
  category: string;
  data: Array<{
    user: { name: string; image: string | null } | null;
    score: number;
    tags: string[];
  }>;
}

export function StyleLeaderboard({ category, data }: StyleLeaderboardProps) {
  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">Top {category} Models</h2>
      <div className="space-y-3">
        {data.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center gap-2">
              <div className="font-bold text-base w-6">{index + 1}</div>
              <Avatar className="w-10 h-10 border-2 border-primary">
                <AvatarImage src={item.user?.image || "/placeholder.svg"} />
                <AvatarFallback>{(item.user?.name || "A")[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {item.user?.name || "Anonymous"}
                </h3>
                <div className="text-xs text-muted-foreground">
                  {item.score} points
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="gap-1 text-xs py-0 h-5">
                  <Crown className="w-3 h-3" />
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
