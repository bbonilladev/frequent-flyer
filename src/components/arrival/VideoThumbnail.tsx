import { useRef } from "react";
import type { CSSProperties } from "react";

interface VideoThumbnailProps {
  url: string;
  thumbnailUrl?: string;
  className?: string;
  style?: CSSProperties;
}

// Renders the best available thumbnail for any video entry:
//   1. thumbnail_url from API  2. native <video> first frame (MP4)
export function VideoThumbnail({ url, thumbnailUrl, className, style }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // For MP4: seek to 2s once metadata is ready so the poster frame is interesting
  function handleLoadedMetadata() {
    if (videoRef.current) videoRef.current.currentTime = 2;
  }

  if (thumbnailUrl) {
    return <img src={thumbnailUrl} alt="" aria-hidden="true" className={className} style={style} />;
  }
  // Native video (MP4 etc.) — muted, no controls, just shows a frame
  return (
    <video
      ref={videoRef}
      src={url}
      muted
      playsInline
      preload="metadata"
      onLoadedMetadata={handleLoadedMetadata}
      className={className}
      style={style}
    />
  );
}
