"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function AuthMiddleware() {
  const router = useRouter();
  const session = useSession();

//   if (!session.data?.user) {
//     router.push("/sign-in");
//   }
  return null;
}
