import { apodPageUrl } from "../../lib/format";
import { VideoThumbnail } from "./VideoThumbnail";
import { PlayPill } from "../ui/PlayPill";

interface VideoEmbedProps {
  url: string;
  title: string;
  date: string;
  thumbnailUrl?: string;
}

// "Watch on NASA APOD" card used in place of a photo when an entry is a video.
export function VideoEmbed({ url, title, date, thumbnailUrl }: VideoEmbedProps) {
  return (
    <a
      href={apodPageUrl(date)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View "${title}" on NASA APOD (opens in new tab)`}
      className="group relative block w-full overflow-hidden"
      style={{ height: 240, background: "var(--color-void)", flexShrink: 0 }}
    >
      <VideoThumbnail
        url={url}
        thumbnailUrl={thumbnailUrl}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{ filter: "brightness(0.72)" }}
      />
      <PlayPill size="lg" />
      {/* Hover tint */}
      <div className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100" style={{ background: "rgba(255,77,0,0.07)" }} />
    </a>
  );
}
