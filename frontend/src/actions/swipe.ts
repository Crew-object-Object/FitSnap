"use server";

import prisma from "@/lib/prisma";
import { SwipeType } from "@prisma/client"; 

export async function swiped(formData: FormData) {
  try {
    const direction = formData.get("direction");
    const fit = formData.get("fitData");

    if (!direction || !fit) {
      return {
        message: "Invalid input: direction or fitData is missing",
        success: false,
      };
    }

    const fitData = JSON.parse(fit as string);
    const swipeType: SwipeType = direction === "right" ? "Like" : "Dislike";

    await prisma.swipe.create({
      data: {
        userId: fitData.userId,
        fitId: fitData.id,
        swipeType,
      },
    });

    return {
      message: "Swipe recorded successfully",
      success: true,
    };
  } catch (error) {
    console.error("Swipe error:", error);
    return {
      message: "An error occurred while processing the swipe",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
