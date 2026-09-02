import { useEffect } from "react";
import type { RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isVisible(el: HTMLElement): boolean {
  return el.offsetParent !== null || el === document.activeElement;
}

// Keeps Tab/Shift+Tab cycling within containerRef's focusable descendants
// while active (WCAG 2.4.3 Focus Order — background content must not be
// reachable while a modal dialog covers it), and restores focus to whatever
// element had it before the trap activated once it deactivates or unmounts.
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [containerRef, active]);
}
