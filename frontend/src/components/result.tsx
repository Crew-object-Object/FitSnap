"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Result({ result }: { result: string[] }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Your Fit Result</h2>
      {result.result_url && (
        <div className="mb-6">
          <Image
            width={300}
            unoptimized
            height={300}
            alt="Fit result"
            className="mx-auto rounded-lg"
            src={result.result_url || "/placeholder.svg"}
          />
        </div>
      )}
      {result.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl font-bold text-primary"
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {result.map((element) => element)}
        </motion.div>
      )}
      <p className="mt-4 text-lg">
        This is your recommended size based on your measurements and photo.
      </p>
    </div>
  );
}
