"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function AuthMiddleware() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.isPending && !session.data?.user) {
      router.push("/sign-in");
    }
  }, [session.isPending, session.data?.user]);

  return null;
}
