import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { defaultRoutes, ROUTES } from "./consts/routes";
import { accessibleUrls } from "./consts/role-based-routing";

const publicRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP]; // Add other public-only routes here. e.g. /auth/register

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(token?.role, token?.role[0], "token");

  const expectedRoutes = defaultRoutes;

  const { pathname } = request.nextUrl;

  // Check if the current route is a public-only route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  console.log(isPublicRoute, "isPublicRoute", !!token?.role[0]);
  

  // If the user is logged in and trying to access a public-only route,
  // redirect them to the home page.
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  // If the user is not logged in and trying to access a protected route,
  // redirect them to the login page.
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  if (!isPublicRoute && !token?.role) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  if (!!token?.role) {
    const defaultUrl = expectedRoutes[token?.role[0]];
    const allowedUrls = accessibleUrls(token?.role[0]);

    console.log("token check pass", defaultUrl, pathname.slice(1, pathname.length), pathname.slice(1, pathname.length) === "");
    

    if(pathname != "/" && pathname.slice(1, pathname.length) === "") {
      return NextResponse.redirect(new URL(defaultUrl, request.url));
    }

    console.log("pathname check pass", defaultUrl);


    const isAllowedUrl = allowedUrls.some((route) =>
      pathname
        .slice(1, pathname.length)
        .includes(route.slice(1, pathname.length)),
    );
    console.log(
      !!token?.role,
      isAllowedUrl,
      pathname.slice(1, pathname.length),
      allowedUrls,
      defaultUrl,
      "isAllowedUrl",
    );

    if (!isAllowedUrl && pathname !== defaultUrl) {
      return NextResponse.redirect(new URL(defaultUrl, request.url));
    }
  }

  return NextResponse.next();
}

// Match all paths except for static files and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
