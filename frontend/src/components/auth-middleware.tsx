"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function AuthMiddleware() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.data) {
      router.push("/sign-in");
    }
  }, [session.data?.user, router]);

  return null;
}
