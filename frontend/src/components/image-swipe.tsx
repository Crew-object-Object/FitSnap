"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH3 } from "./typography/H3";
import { TypographyP } from "./typography/P";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Fit } from "@prisma/client";
import Image from "next/image";
import { swiped } from "@/actions/swipe";

interface SwipeCardsProps {
  props: Fit[];
}

export default function SwipeCards({ props }: SwipeCardsProps) {
  console.log(props);
  const [currentProfile, setCurrentProfile] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [likes, setLikes] = useState(props.map(() => 0));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  async function Swipe(direction: string, fitData: Fit) {
    console.log(props);
    const formData = new FormData();
    formData.append("direction", direction);
    formData.append("fitData", JSON.stringify(fitData));

    const response = await swiped(formData);
    console.log(response);
  }

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      const newDirection = info.offset.x > 0 ? "right" : "left";
      setDirection(newDirection);
      Swipe(newDirection, props[currentProfile]);
      setTimeout(() => {
        setCurrentProfile((prev) => (prev + 1) % props.length);
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
          {currentProfile < props.length && (
            <motion.div
              key={props[currentProfile].id}
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
                  <Image
                    src={props[currentProfile].image || "/placeholder.svg"}
                    alt={`Fit Image ${currentProfile + 1}`}
                    width={300}
                    height={300}
                  />
                  <div className="p-2 bg-primary flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <TypographyH3>Fit #{currentProfile + 1}</TypographyH3>
                        <TypographyP>
                          {props[currentProfile].description}
                        </TypographyP>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button onClick={handleLike} variant="secondary">
                        <Heart className="w-8 h-8" />
                      </Button>
                      <TypographyP>{likes[currentProfile]} Likes</TypographyP>
                    </div>
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {props[currentProfile].tags.map((tag, index) => (
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
