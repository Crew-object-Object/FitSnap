"use client";

import { useEffect } from "react";

type CameraProps = {
  facing: "user" | "environment";
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export default function Camera({ facing, videoRef }: CameraProps) {
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facing, videoRef]);

  return (
    <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
