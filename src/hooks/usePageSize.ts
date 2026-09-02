import { useEffect, useState } from "react";

function sizeForWidth(width: number): number {
  if (width < 768) return 2;
  if (width < 1280) return 4;
  return 6;
}

// Responsive page size for the boarding-pass grid: 2 on mobile, 4 on tablet, 6 on desktop.
export function usePageSize(): number {
  const [size, setSize] = useState(() =>
    typeof window === "undefined" ? 6 : sizeForWidth(window.innerWidth),
  );

  useEffect(() => {
    function handleResize() {
      setSize(sizeForWidth(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
