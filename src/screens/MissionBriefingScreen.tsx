import type { DateRange, FilterMode } from "../types";
import { MissionBriefing } from "../components/mission-briefing/MissionBriefing";

interface MissionBriefingScreenProps {
  filterMode: FilterMode;
  dateRange: DateRange;
  randomCount: number;
  loading: boolean;
  error: string | null;
  onModeChange: (m: FilterMode) => void;
  onDateChange: (r: DateRange) => void;
  onCountChange: (n: number) => void;
  onRetrieve: () => void;
}

export function MissionBriefingScreen(props: MissionBriefingScreenProps) {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col mx-auto w-full px-4 md:px-8 overflow-y-auto relative outline-none" style={{ maxWidth: 1120 }}>
      <MissionBriefing {...props} />
    </main>
  );
}
