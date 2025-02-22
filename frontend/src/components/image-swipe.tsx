"use client";

import Image from "next/image";
import prisma from "@/lib/prisma";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { DockDemo } from "./emoji-dock";
import { swiped } from "@/actions/swipe";
import { useState, useEffect } from "react";
import { TypographyH3 } from "./typography/H3";
import type { Fit, Prisma, Swipe } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

interface SwipeCardsProps {
  props: Prisma.FitGetPayload<{
    include: {
      swipes: {
        where: {
          swipeType: "Like";
        };
      };
      user: true;
      _count: {
        select: {
          swipes: {
            where: {
              swipeType: "Like";
            };
          };
        };
      };
    };
  }>[];
}

export default function SwipeCards({ props }: SwipeCardsProps) {
  const [currentProfile, setCurrentProfile] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [likes, setLikes] = useState(props.map((fit) => fit._count.swipes));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  async function Swipe(direction: string, fitData: Fit) {
    const formData = new FormData();
    formData.append("direction", direction);
    formData.append("fitData", JSON.stringify(fitData));

    await swiped(formData);
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
    <div className="flex flex-col items-center justify-start min-h-screen overflow-hidden touch-none">
      <div className="w-full max-w-sm mt-4">
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
              className="cursor-grab active:cursor-grabbing touch-none"
            >
              <Card className="overflow-hidden shadow-lg relative gradient-border">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/5] w-full">
                    <Image
                      unoptimized
                      src={props[currentProfile].image || "/placeholder.svg"}
                      alt={`Fit Image ${currentProfile + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-foreground">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <TypographyH3>
                            {props[currentProfile].user.name}
                          </TypographyH3>
                          <p className="text-base text-gray-200">
                            {props[currentProfile].description}
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={handleLike}
                            className="bg-primary/75 hover:bg-foreground/30 text-foreground rounded-full p-3"
                          >
                            <Heart className="w-8 h-8" />
                          </Button>
                          <span className="text-sm font-medium text-white">
                            {likes[currentProfile]}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {props[currentProfile].tags.map((tag, index) => (
                          <Badge
                            key={index}
                            className="text-sm px-3 py-1 bg-foreground/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-auto w-full flex justify-center pb-6">
        <DockDemo />
      </div>
    </div>
  );
}
