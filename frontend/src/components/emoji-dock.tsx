"use client";

import { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { swiped } from "@/actions/swipe";

const emojis = ["😂", "🙂", "🥰", "🤩", "🤐", "🔥"];

export function DockDemo({
  id,
  setCurrentProfile,
  propsLength,
}: {
  id: string;
  setCurrentProfile: (value: SetStateAction<number>) => void;
  propsLength: number;
}) {
  const [bursts, setBursts] = useState<
    { id: number; emoji: string; x: number }[]
  >([]);

  const handleClick = (emoji: string) => {
    const newBurst = {
      id: Date.now(),
      emoji,
      x: Math.random() * 200 - 100,
    };
    setBursts((prev) => [...prev, newBurst]);

    const formData = new FormData();
    formData.append("direction", "right");
    formData.append("fitData", `{ "id": "${id}" }`);
    swiped(formData);

    setCurrentProfile((prev: number) => (prev + 1) % propsLength);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 p-2 bg-black/30 backdrop-blur-md rounded-full shadow-lg">
      {emojis.map((emoji) => (
        <motion.button
          key={emoji}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleClick(emoji)}
          className="text-2xl p-2 rounded-full hover:bg-white/20"
        >
          {emoji}
        </motion.button>
      ))}

      {bursts.map((burst) => (
        <motion.div
          key={burst.id}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -100 }}
          transition={{ duration: 1 }}
          className="absolute text-4xl"
          style={{ left: "50%", transform: `translateX(${burst.x}px)` }}
        >
          {burst.emoji}
        </motion.div>
      ))}
    </div>
  );
}
