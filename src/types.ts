export interface ApodEntry {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  thumbnail_url?: string;
  media_type: string;
  copyright?: string;
}

export interface DateRange {
  start: string | null;
  end: string | null;
}

export type FilterMode = "range" | "random";

export interface LightboxState {
  src: string;
  alt: string;
}
