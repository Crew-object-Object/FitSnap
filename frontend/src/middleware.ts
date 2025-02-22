import { auth } from "./lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/sign-in", "/sign-up", "/api/auth"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const isAuth = !!session?.user;

    if (isAuth && pathname === "/sign-in") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!isAuth && !isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
