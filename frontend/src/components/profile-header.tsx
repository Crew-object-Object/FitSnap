"use client";

import Image from "next/image";
import { useSession } from "@/lib/auth-client";

export function ProfileHeader() {
  const session = useSession();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600 to-purple-900 h-72" />

      <div className="relative container mx-auto px-4 pt-20 pb-32 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          {session.data?.user.name}
        </h1>
        <p className="text-lg text-white/80 mb-8">{session.data?.user.email}</p>

        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-32 h-32 rounded-full bg-rose-400 border-4 border-background overflow-hidden">
            <Image
              width={128}
              unoptimized
              height={128}
              alt={session.data?.user.name || "Profile Picture"}
              src={session.data?.user.image || "/favicon.png"}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
