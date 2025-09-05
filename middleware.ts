// middleware.ts
import { withAuth } from "next-auth/middleware";

// Force everything (except signin + auth API) through NextAuth
export default withAuth({
  pages: { signIn: "/signin" },
});

export const config = {
  // ✅ Protect ALL routes except /signin and /api/auth/*
  matcher: ["/((?!signin|api/auth).*)"],
};
