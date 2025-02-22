"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Profile {
  id: number;
  name: string;
  age: number;
  image: string;
}

const profiles: Profile[] = [
  {
    id: 1,
    name: "Sarah",
    age: 28,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    name: "James",
    age: 32,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    name: "Emma",
    age: 25,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    name: "Michael",
    age: 30,
    image: "/placeholder.svg?height=400&width=300",
  },
];

export default function SwipeCards() {
  const [currentProfile, setCurrentProfile] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);

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

  const handleButtonClick = (direction: "left" | "right") => {
    setDirection(direction);
    setTimeout(() => {
      setCurrentProfile((prev) => (prev + 1) % profiles.length);
      setDirection(null);
    }, 200);
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
              <Card className="h-[400px] w-[300px]">
                <CardContent className="p-0">
                  <img
                    src={profiles[currentProfile].image || "/placeholder.svg"}
                    alt={profiles[currentProfile].name}
                    className="h-[300px] w-full object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-2xl font-semibold">
                      {profiles[currentProfile].name},{" "}
                      {profiles[currentProfile].age}
                    </h2>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <Button
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full"
          onClick={() => handleButtonClick("left")}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full"
          onClick={() => handleButtonClick("right")}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
