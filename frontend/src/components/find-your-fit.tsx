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
import prisma from "@/lib/prisma";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DetectionAction } from "@/actions/detection";
import { motion, AnimatePresence } from "framer-motion";
import { Fit } from "@prisma/client";

interface DetectionResult {
  predicted_size: string[];
}

interface CameraProps {
  facing: "user" | "environment";
  videoRef: React.RefObject<HTMLVideoElement>;
}

export default function FindYourFit({
  id,
  fitData,
}: {
  id?: string;
  fitData: Fit | null;
}) {
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">(
    "user"
  );
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<DetectionResult>({
    predicted_size: [""],
  });

  const captureScreenshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const screenshotFile = new File([blob], "screenshot.png", {
              type: "image/png",
            });
            setFile(screenshotFile);
            handleProceed(screenshotFile);
          }
        }, "image/png");
      }
    }
  };

  async function DetectionActionCall(
    age: string,
    height: string,
    weight: string,
    screenshotFile: File
  ): Promise<DetectionResult> {
    const formData = new FormData();
    formData.append("age", age);
    formData.append("height", height);
    formData.append("weight", weight);
    const file_url = fitData?.image || "";
    formData.append("file_url", file_url);
    formData.append("fileImage", screenshotFile);

    const result = await DetectionAction(formData);
    return result;
  }

  const handleProceed = async (screenshotFile: File) => {
    setStep("loading");
    const result = await DetectionActionCall(
      age,
      height,
      weight,
      screenshotFile
    );
    setResult(result);
    setStep("result");
  };

  const isFormValid = height && weight && age;

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait" initial={false}>
        {step === "input" && (
          <motion.div
            key="input"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <h1 className="text-2xl font-bold mb-6">Find Your Fit</h1>
            <Camera facing={cameraFacing} videoRef={videoRef} />
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
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  captureScreenshot();
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
            <Result result={result.predicted_size} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
