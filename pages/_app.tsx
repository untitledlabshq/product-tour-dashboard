import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <article className="min-h-screen bg-neutral-900 text-white">
      <Component {...pageProps} />
    </article>
  );
}
