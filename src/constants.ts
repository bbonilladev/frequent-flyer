export const APOD_MIN = "1995-06-16";
export const TODAY = new Date().toISOString().split("T")[0];

export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Staggered delays so collage skeleton squares breathe in a wave rather than all at once
export const SKELETON_DELAYS = [
  0, 0.3, 0.6, 0.15, 0.45, 0.75, 0.1, 0.4, 0.7, 0.25, 0.55, 0.05, 0.35, 0.65, 0.2, 0.5, 0.8, 0.0,
];
