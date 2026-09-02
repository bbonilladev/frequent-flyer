import type { ApodEntry } from "../types";

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";
const APOD_BASE_URL = "https://api.nasa.gov/planetary/apod";

// Recent, wide-enough window guaranteed to contain image (not video) entries,
// used as a fallback source for the name-gate collage when the primary count-based
// request fails or returns nothing usable.
const COLLAGE_FALLBACK_RANGE = { start: "2026-01-01", end: "2026-03-01" };
const COLLAGE_CANDIDATE_LIMIT = 18;

async function parseApodErrorMessage(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.error?.message || `HTTP ${res.status}`;
}

async function apodFetch(params: URLSearchParams, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(`${APOD_BASE_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(await parseApodErrorMessage(res));
  return res.json();
}

function normalize(data: unknown): ApodEntry[] {
  return Array.isArray(data) ? data : [data as ApodEntry];
}

function imageUrls(entries: ApodEntry[]): string[] {
  return entries
    .filter((e) => e.media_type === "image" && !!e.url)
    .slice(0, COLLAGE_CANDIDATE_LIMIT)
    .map((e) => e.url);
}

export async function fetchApodRange(
  start: string,
  end: string,
  signal?: AbortSignal,
): Promise<ApodEntry[]> {
  const data = await apodFetch(
    new URLSearchParams({ api_key: NASA_API_KEY, start_date: start, end_date: end, thumbs: "true" }),
    signal,
  );
  return normalize(data).reverse();
}

export async function fetchApodRandom(count: number, signal?: AbortSignal): Promise<ApodEntry[]> {
  const data = await apodFetch(
    new URLSearchParams({ api_key: NASA_API_KEY, count: String(count), thumbs: "true" }),
    signal,
  );
  return normalize(data);
}

// Returns candidate image URLs for the name-gate collage background: a primary
// batch of 30 recent entries, falling back to a fixed date range if that batch
// fails or yields no usable images. Never throws — an empty array means "no collage".
export async function fetchApodCollageCandidates(signal?: AbortSignal): Promise<string[]> {
  try {
    const data = await apodFetch(
      new URLSearchParams({ api_key: NASA_API_KEY, count: "30", thumbs: "true" }),
      signal,
    );
    const candidates = imageUrls(normalize(data));
    if (candidates.length > 0) return candidates;
  } catch {
    // fall through to the fixed-range fallback below
  }

  try {
    const data = await apodFetch(
      new URLSearchParams({
        api_key: NASA_API_KEY,
        start_date: COLLAGE_FALLBACK_RANGE.start,
        end_date: COLLAGE_FALLBACK_RANGE.end,
        thumbs: "true",
      }),
      signal,
    );
    return imageUrls(normalize(data));
  } catch {
    return [];
  }
}
