"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Shirt, PenIcon as Pants } from "lucide-react";

interface Result {
  predicted_size: string[];
  pants_fit?: string;
  shirt_fit?: string;
  pants_size?: string;
  shirt_size?: string;
  result_url?: string;
}

export default function Result({ result }: { result: Result }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [averageSize, setAverageSize] = useState<string | null>(null);

  useEffect(() => {
    if (result.predicted_size.length > 1) {
      const numericSizes = result.predicted_size
        .map((size) => Number.parseInt(size))
        .filter((size) => !isNaN(size));

      if (numericSizes.length > 0) {
        const avg = numericSizes.reduce((a, b) => a + b) / numericSizes.length;
        setAverageSize(avg.toFixed(1));
      }
    }
  }, [result.predicted_size]);

  const sizeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    }),
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-2xl font-bold text-center">
          Your Fit Result
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-center space-x-4">
                  {result.predicted_size.map((size, index) => (
                    <motion.div
                      key={index}
                      variants={sizeVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      className="flex items-center justify-center w-16 h-16 bg-secondary text-secondary-foreground rounded-full"
                    >
                      <span className="text-2xl font-bold">{size}</span>
                    </motion.div>
                  ))}
                </div>
                {averageSize && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-muted-foreground"
                  >
                    Average size: {averageSize}
                  </motion.p>
                )}
                {result.result_url && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="relative w-full aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}${result.result_url}` ||
                        "/placeholder.svg"
                      }
                      alt="Fit visualization"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="details" className="mt-4">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Shirt className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Shirt</h3>
                    </div>
                    <Badge variant="secondary">{result.shirt_size}</Badge>
                    <p className="text-sm text-muted-foreground">
                      {result.shirt_fit} fit
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Pants className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Pants</h3>
                    </div>
                    <Badge variant="secondary">{result.pants_size}</Badge>
                    <p className="text-sm text-muted-foreground">
                      {result.pants_fit}
                    </p>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center space-x-2 text-green-600"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-medium">Perfect match found</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
