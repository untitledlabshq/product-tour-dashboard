import React from "react";
import { useRouter } from "next/router";

const LOADER_THRESHOLD = 250;

export default function NavigationLoader() {
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timer: any;

    const start = () => {
      end();
      return (timer = setTimeout(() => setLoading(true), LOADER_THRESHOLD));
    };

    const end = () => {
      if (timer) {
        clearTimeout(timer);
      }
      setLoading(false);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);

      if (timer) {
        clearTimeout(timer.current);
      }
    };
  }, [router.events]);

  if (!isLoading) return null;

  return (
    <div className="navigation-loader">
      <img src="/icon.jpg" width={200} className="animate-pulse rounded-full" />
    </div>
  );
}
