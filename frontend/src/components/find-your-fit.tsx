"use client";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import Camera from "./camera";
import Result from "./result";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { DetectionAction } from "@/actions/detection";
import prisma from "@/lib/prisma";

export default function FindYourFit({ id }: { id?: string }) {
  const [step, setStep] = useState("input");
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">(
    "user"
  );
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<{ image?: string; size?: string }>(
    id ? { image: "/placeholder.svg?height=300&width=300", size: "M" } : {}
  );
  const [file, setFile] = useState<File | null>(null);

  async function DetectionActionCall(
    height: string,
    age: string,
    weight: string
  ) {
    const fitData = await prisma.fit.findFirst({
      where: {
        id: id,
      },
    });

    const fileUrl = fitData?.image;
    const formData = new FormData();
    formData.append("height", height);
    formData.append("age", age);
    formData.append("weight", weight);
    formData.append("imageUrl", fileUrl!);
    formData.append("file", JSON.stringify(file));

    console.log(file);
    const response = await DetectionAction(formData);
  }
  const handleProceed = async () => {
    setStep("loading");
    setResult({ image: "/placeholder.svg?height=300&width=300", size: "M" });
    setStep("result");
    await DetectionActionCall(height, age, weight);
  };

  const isFormValid = height && weight && age;

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait" initial={false}>
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-6">Find Your Fit</h1>
            <Camera facing={cameraFacing} />
            <div className="mt-4 mb-6">
              <Select
                value={cameraFacing}
                onValueChange={(value) =>
                  setCameraFacing(value as "user" | "environment")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Front Camera</SelectItem>
                  <SelectItem value="environment">Back Camera</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <form className="space-y-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="file">Upload File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleProceed();
                }}
                disabled={!isFormValid}
              >
                Proceed
              </Button>
            </form>
          </motion.div>
        )}

        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Result result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
