import { Modal } from "../ui/Modal";
import { CloseButton } from "../ui/CloseButton";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

// Full-bleed image viewer, the topmost overlay in the app.
export function Lightbox({ src, alt, onClose }: LightboxProps) {
  return (
    <Modal onClose={onClose} ariaLabel={alt} background="rgba(5,8,14,0.97)" blur={10} zIndex="var(--z-lightbox)">
      {(closeButtonRef) => (
        <>
          <CloseButton ref={closeButtonRef} onClick={onClose} label="Close image viewer" size="lg" className="absolute top-4 right-4 z-10" />
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: "92vh", maxWidth: "92vw" }}
          />
          <p
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-caption tracking-[0.25em]"
            style={{ color: "var(--color-navy-300)", fontFamily: "var(--font-mono)" }}
            aria-hidden="true"
          >
            ESC TO CLOSE
          </p>
        </>
      )}
    </Modal>
  );
}
