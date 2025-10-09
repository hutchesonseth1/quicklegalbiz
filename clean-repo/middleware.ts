export { default } from "next-auth/middleware";

// Protect specific routes
export const config = {
  matcher: ["/dashboard/:path*"], // protect /dashboard and its subpages
};