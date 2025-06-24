import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROUTES } from "./consts/routes";

const publicRoutes = [ROUTES.login, ROUTES.signUp]; // Add other public-only routes here. e.g. /auth/register

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Check if the current route is a public-only route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If the user is logged in and trying to access a public-only route,
  // redirect them to the home page.
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL(ROUTES.home, request.url));
  }

  // If the user is not logged in and trying to access a protected route,
  // redirect them to the login page.
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  return NextResponse.next();
}

// Match all paths except for static files and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 