import { useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { useModalDismiss } from "../../hooks/useModalDismiss";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface ModalProps {
  onClose: () => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  background: string;
  blur: number;
  zIndex: string;
  className?: string;
  children: (closeButtonRef: RefObject<HTMLButtonElement | null>) => ReactNode;
}

// Fixed-inset backdrop shell shared by every full-screen modal: handles the
// ESC-to-close + focus-on-mount boilerplate (via useModalDismiss), traps Tab
// within the dialog and restores focus to the trigger on close (via
// useFocusTrap), and closes on a direct backdrop click without swallowing
// clicks inside the content.
export function Modal({ onClose, ariaLabel, ariaLabelledBy, background, blur, zIndex, className, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  // Order matters: useFocusTrap must capture document.activeElement (the
  // trigger that opened this modal) in its mount effect *before*
  // useModalDismiss's own mount effect moves focus onto the close button —
  // otherwise the trap "restores" focus to the close button, which is
  // itself unmounting, rather than back to the real trigger.
  useFocusTrap(overlayRef, true);
  const closeButtonRef = useModalDismiss<HTMLButtonElement>(onClose);

  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- ESC already closes via useModalDismiss, so a full keyboard equivalent exists even though it isn't a handler on this element.
    <div
      ref={overlayRef}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- swapping to <dialog> would change useFocusTrap/useModalDismiss semantics.
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`fixed inset-0 flex items-center justify-center ${className ?? ""}`}
      style={{ background, backdropFilter: `blur(${blur}px)`, zIndex }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {children(closeButtonRef)}
    </div>
  );
}
