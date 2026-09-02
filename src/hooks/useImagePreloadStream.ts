import { useEffect, useState } from "react";

interface ImagePreloadStream {
  loadedUrls: string[];
  isLoading: boolean;
}

// Preloads each candidate URL via a throwaway Image() and streams them into
// loadedUrls as they resolve, so a caller can progressively reveal images
// rather than waiting for the whole batch. isLoading clears as soon as the
// first image is ready (or once every candidate has settled, in case all
// of them fail). Guards against setting state after the urls batch changes
// or the consuming component unmounts.
export function useImagePreloadStream(urls: string[]): ImagePreloadStream {
  const [loadedUrls, setLoadedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset synchronously during render when a new batch arrives, rather than
  // via an effect — see https://react.dev/learn/you-might-not-need-an-effect
  const [trackedUrls, setTrackedUrls] = useState(urls);
  if (trackedUrls !== urls) {
    setTrackedUrls(urls);
    setLoadedUrls([]);
    setIsLoading(urls.length > 0);
  }

  useEffect(() => {
    if (urls.length === 0) return;

    let cancelled = false;
    let settledCount = 0;
    let firstLoaded = false;

    urls.forEach((url) => {
      const img = new window.Image();
      img.onload = () => {
        if (cancelled) return;
        settledCount++;
        if (!firstLoaded) {
          firstLoaded = true;
          setIsLoading(false);
        }
        setLoadedUrls((prev) => [...prev, url]);
      };
      img.onerror = () => {
        if (cancelled) return;
        settledCount++;
        if (settledCount === urls.length && !firstLoaded) setIsLoading(false);
      };
      img.src = url;
    });

    return () => {
      cancelled = true;
    };
  }, [urls]);

  return { loadedUrls, isLoading };
}
