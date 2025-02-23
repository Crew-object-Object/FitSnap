import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopThree({
  winners,
}: {
  winners: {
    position: number;
    name: string;
    points: string;
    avatar: string;
    color: string;
  }[];
}) {
  return (
    <div className="relative">
      <div className="flex justify-center items-end gap-4 h-[300px]">
        {winners.map((winner) => (
          <div
            key={winner.position}
            className={`relative flex flex-col items-center ${
              winner.position === 1
                ? "mb-8"
                : winner.position === 2
                ? "mb-4"
                : ""
            }`}
          >
            <Card
              className={`
              w-64 p-6 flex flex-col items-center gap-4
              transform transition-all duration-300 hover:scale-105
              ${
                winner.position === 1
                  ? "bg-gradient-to-b from-yellow-300 to-yellow-500"
                  : ""
              }
            `}
            >
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={winner.avatar} />
                  <AvatarFallback>{winner.name[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${winner.color} flex items-center justify-center`}
                >
                  <Trophy
                    className={`w-5 h-5 ${
                      winner.position === 1 ? "text-white" : "text-gray-800"
                    }`}
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">{winner.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {winner.points} points
                </p>
              </div>
              <div className="absolute -bottom-8 text-4xl font-bold text-primary">
                #{winner.position}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
