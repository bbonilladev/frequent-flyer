import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useEscapeKey } from "./useEscapeKey";

// Focuses the returned ref's element on mount and calls onClose on Escape —
// the boilerplate every full-screen modal in this app needs.
export function useModalDismiss<T extends HTMLElement>(
  onClose: () => void,
  active = true,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEscapeKey(onClose, active);

  useEffect(() => {
    if (active) ref.current?.focus();
  }, [active]);

  return ref;
}
