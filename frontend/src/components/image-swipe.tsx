"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH3 } from "./typography/H3";
import { TypographyP } from "./typography/P";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface Profile {
  id: number;
  name: string;
  age: number;
  image: string;
  tags: string[];
  likes: number;
}

const profiles: Profile[] = [
  {
    id: 1,
    name: "Sarah",
    age: 28,
    image: "/test.jpg",
    tags: ["badge1", "badge2", "badge3", "badge4"],
    likes: 0,
  },
  {
    id: 2,
    name: "James",
    age: 32,
    image: "/test1.jpg",
    tags: ["badge1", "badge2", "badge3", "badge4"],
    likes: 0,
  },
  {
    id: 3,
    name: "Emma",
    age: 25,
    image: "/test2.jpg",
    tags: ["badge1", "badge2", "badge3", "badge4"],
    likes: 0,
  },
];

export default function SwipeCards() {
  const [currentProfile, setCurrentProfile] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [likes, setLikes] = useState(profiles.map((profile) => profile.likes));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      const direction = info.offset.x > 0 ? "right" : "left";
      setDirection(direction);
      setTimeout(() => {
        setCurrentProfile((prev) => (prev + 1) % profiles.length);
        setDirection(null);
      }, 200);
    }
  };

  const handleLike = () => {
    setLikes((prevLikes) =>
      prevLikes.map((like, index) =>
        index === currentProfile ? like + 1 : like
      )
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 overflow-hidden touch-action-none min-h-[calc(100vh-2rem)]">
      <div className="relative h-[400px] w-[300px]">
        <AnimatePresence>
          {currentProfile < profiles.length && (
            <motion.div
              key={profiles[currentProfile].id}
              initial={{ scale: 1 }}
              animate={{
                scale: 1,
                rotate:
                  direction === "left" ? -20 : direction === "right" ? 20 : 0,
                x:
                  direction === "left" ? -200 : direction === "right" ? 200 : 0,
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute cursor-grab active:cursor-grabbing touch-none"
            >
              <Card className="h-full w-[300px]">
                <CardContent className="p-0">
                  <img
                    src={profiles[currentProfile].image || "/placeholder.svg"}
                    alt={profiles[currentProfile].name}
                    className="h-full w-full object-cover"
                  />
                  <div className="p-2 bg-primary flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <TypographyH3>
                          {profiles[currentProfile].name}
                        </TypographyH3>
                        <TypographyP>
                          {profiles[currentProfile].age} years old
                        </TypographyP>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <button onClick={handleLike} className="text-red-500">
                        <Heart className="w-8 h-8" />
                      </button>
                      <TypographyP>{likes[currentProfile]} Likes</TypographyP>
                    </div>
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {profiles[currentProfile].tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
