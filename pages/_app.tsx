import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  // weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <article
      className={
        "min-h-screen bg-neutral-50 dark:bg-neutral-900 dark:text-white " +
        montserrat.className
      }
    >
      <Component {...pageProps} />
    </article>
  );
}
