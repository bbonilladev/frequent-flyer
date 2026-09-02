import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import type { ApodEntry, DateRange, FilterMode, LightboxState } from "./types";
import { fetchApodRandom, fetchApodRange } from "./lib/apod";
import { toFlightError } from "./lib/format";
import { NameModal } from "./components/name-gate/NameModal";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { SkipLink } from "./components/layout/SkipLink";
import { ArrivalModal } from "./components/arrival/ArrivalModal";
import { Lightbox } from "./components/lightbox/Lightbox";
import { MissionBriefingScreen } from "./screens/MissionBriefingScreen";
import { FlightLogScreen } from "./screens/FlightLogScreen";

const PASSENGER_STORAGE_KEY = "ff_passenger";
const ERROR_DISMISS_MS = 10_000;

function AppShell() {
  const [passengerName, setPassengerName] = useState<string>(
    () => localStorage.getItem(PASSENGER_STORAGE_KEY) || "",
  );
  const [filterMode, setFilterMode] = useState<FilterMode>("range");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [randomCount, setRandomCount] = useState(9);
  const [flights, setFlights] = useState<ApodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queried, setQueried] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [selected, setSelected] = useState<ApodEntry | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), ERROR_DISMISS_MS);
    return () => clearTimeout(t);
  }, [error]);

  // Cancel any in-flight request when the component unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  // The Mission Briefing <-> Flight Log swap unmounts whatever had focus
  // (e.g. the just-clicked "Retrieve Flights" button), which would silently
  // drop keyboard/screen-reader focus to <body>. Move it to the newly shown
  // screen's <main> instead — skip on the very first render so we don't
  // steal focus on initial page load.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById("main-content")?.focus();
  }, [showSearch]);

  const saveName = useCallback((name: string) => {
    localStorage.setItem(PASSENGER_STORAGE_KEY, name);
    setPassengerName(name);
  }, []);

  const fetchRange = useCallback(async () => {
    if (!dateRange.start) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setQueried(true);
    try {
      const from = dateRange.start;
      const to = dateRange.end || dateRange.start;
      const data = await fetchApodRange(from, to, controller.signal);
      setFlights(data);
      setShowSearch(false);
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(toFlightError(e));
      setFlights([]);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [dateRange]);

  const fetchRandom = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setQueried(true);
    try {
      const data = await fetchApodRandom(randomCount, controller.signal);
      setFlights(data);
      setShowSearch(false);
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(toFlightError(e));
      setFlights([]);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [randomCount]);

  const handleRetrieve = useCallback(() => {
    if (filterMode === "range") fetchRange();
    else fetchRandom();
  }, [filterMode, fetchRange, fetchRandom]);

  // Clicking the wordmark acts as a "home" link: cancel any in-flight
  // retrieval and reset back to a fresh Mission Briefing.
  const handleGoHome = useCallback(() => {
    abortRef.current?.abort();
    setFilterMode("range");
    setDateRange({ start: null, end: null });
    setRandomCount(9);
    setFlights([]);
    setLoading(false);
    setError(null);
    setQueried(false);
    setShowSearch(true);
    setSelected(null);
    setLightbox(null);
  }, []);

  if (!passengerName) return <NameModal onSave={saveName} />;

  function handleModeChange(m: FilterMode) {
    setFilterMode(m);
    setError(null);
  }

  return (
    <div
      className="flex flex-col"
      style={{
        background: "var(--color-deep-space)",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <SkipLink />
      <Header
        passengerName={passengerName}
        onEditName={() => setPassengerName("")}
        onSignOut={() => {
          setPassengerName("");
          localStorage.removeItem(PASSENGER_STORAGE_KEY);
        }}
        onGoHome={handleGoHome}
      />

      {showSearch ? (
        <MissionBriefingScreen
          filterMode={filterMode}
          dateRange={dateRange}
          randomCount={randomCount}
          loading={loading}
          error={error}
          onModeChange={handleModeChange}
          onDateChange={setDateRange}
          onCountChange={setRandomCount}
          onRetrieve={handleRetrieve}
        />
      ) : (
        <FlightLogScreen
          filterMode={filterMode}
          dateRange={dateRange}
          randomCount={randomCount}
          flights={flights}
          loading={loading}
          error={error}
          queried={queried}
          passengerName={passengerName}
          onNewSearch={() => {
            setShowSearch(true);
            setError(null);
          }}
          onRetry={handleRetrieve}
          onOpen={(entry) => setSelected(entry)}
          onImageClick={(src, alt) => setLightbox({ src, alt })}
        />
      )}

      <Footer />

      {selected && (
        <ArrivalModal
          entry={selected}
          passengerName={passengerName}
          onClose={() => setSelected(null)}
          onImageClick={(src, alt) => setLightbox({ src, alt })}
        />
      )}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />} />
    </Routes>
  );
}
