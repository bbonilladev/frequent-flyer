import { useEffect } from "react";
import type { RefObject } from "react";

// Accepts one ref, or several when the dismissible region spans disconnected
// DOM subtrees (e.g. a trigger button plus a dropdown portaled to <body>).
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  onOutside: () => void,
  active = true,
): void {
  useEffect(() => {
    if (!active) return;
    const refList = Array.isArray(refs) ? refs : [refs];
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      const isInside = refList.some((ref) => ref.current?.contains(target));
      if (!isInside) onOutside();
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [refs, onOutside, active]);
}
