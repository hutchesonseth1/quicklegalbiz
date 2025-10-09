import type { AppProps } from "next/app";
import "../styles/globals.css";

// If you use NextAuth, you can wrap with SessionProvider later.
// import { SessionProvider } from "next-auth/react";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <SessionProvider session={pageProps.session}>
    <Component {...pageProps} />
    // </SessionProvider>
  );
}