// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account consent" } },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 30, // 30 minutes
  },
  jwt: {
    maxAge: 60 * 30,
  },
  callbacks: {
    async signIn({ user }) {
      // ✅ Only these accounts may sign in during testing
      const allowed = [
        "your.email@gmail.com",     // replace with your Google email
        "your.brother@gmail.com",   // add/remove as needed
      ];

      if (!allowed.includes(user.email!)) {
        console.warn(`Blocked login attempt by: ${user.email}`);
        return false; // Deny login
      }
      return true;
    },
    async jwt({ token }) {
      const now = Math.floor(Date.now() / 1000);
      if (!token.iat || now - (token.iat as number) > 600) {
        token.iat = now; // rotate every 10 min
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) (session as any).sub = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
