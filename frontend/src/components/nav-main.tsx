"use client";

import {
  useSidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from "./ui/sidebar";
import {
  User2,
  CogIcon,
  ChevronUp,
  LogInIcon,
  LogOutIcon,
  LoaderCircle,
  LayoutDashboardIcon,
  Trophy,
  Shirt,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function HomeButton() {
  const { setOpenMobile } = useSidebar();

  return (
    <Button
      className="w-full justify-start text-start h-fit"
      variant="secondary"
      onClick={() => setOpenMobile(false)}
      asChild
    >
      <Link className="text-xl font-semibold w-full p-2" href="/">
        <Image alt="logo" width={48} height={48} src="/favicon.png" />
        FitSnap
      </Link>
    </Button>
  );
}

export function SidebarNavigation() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const linkGroups = [
    {
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
        { label: "Find Your Fit", href: "/find-your-fit", icon: Shirt },
        { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { label: "Profile", href: "/profile", icon: User2 },
      ],
    },
  ];

  return linkGroups.map((group, index) => (
    <SidebarGroup key={index}>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                onClick={() => setOpenMobile(false)}
                asChild
              >
                <Link href={item.href}>
                  <item.icon />
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

export function UserDropdownButtons() {
  const { setOpenMobile } = useSidebar();

  return (
    <>
      <DropdownMenuItem asChild>
        <Link href="/settings" onClick={() => setOpenMobile(false)}>
          <CogIcon /> Settings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-destructive"
        onClick={() => {
          signOut();
          localStorage.clear();
        }}
      >
        <LogOutIcon />
        Logout
      </DropdownMenuItem>
    </>
  );
}

export function UserDropdownTriggerButton() {
  const session = useSession();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || session.isPending) {
    return (
      <SidebarMenuButton variant="outline" className="justify-center" disabled>
        <LoaderCircle className="animate-spin" />
      </SidebarMenuButton>
    );
  }

  if (session.error) {
    toast.error("Failed to fetch user session");
    console.error(session.error);
    return null;
  }

  if (!session.data) {
    return (
      <SidebarMenuButton variant="outline" asChild>
        <Link href="/sign-in">
          <LogInIcon /> Login
        </Link>
      </SidebarMenuButton>
    );
  }

  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton variant="outline">
        <User2 /> <span className="truncate">{session.data.user.name}</span>{" "}
        <ChevronUp className="ml-auto" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
}
