import type { ToolExample } from "../core/example.js";
import { createSimpleTool, simpleError } from "../core/simple.js";

export type WorldClockFormat = "12-hour" | "24-hour";
export type WorldClockLocation = {
  readonly name: string;
  readonly timeZone: string;
};

export const worldClockLocations = [
  { name: "UTC", timeZone: "UTC" },
  { name: "Los Angeles", timeZone: "America/Los_Angeles" },
  { name: "New York", timeZone: "America/New_York" },
  { name: "Sao Paulo", timeZone: "America/Sao_Paulo" },
  { name: "London", timeZone: "Europe/London" },
  { name: "Berlin", timeZone: "Europe/Berlin" },
  { name: "Johannesburg", timeZone: "Africa/Johannesburg" },
  { name: "Dubai", timeZone: "Asia/Dubai" },
  { name: "New Delhi", timeZone: "Asia/Kolkata" },
  { name: "Singapore", timeZone: "Asia/Singapore" },
  { name: "Tokyo", timeZone: "Asia/Tokyo" },
  { name: "Sydney", timeZone: "Australia/Sydney" },
] as const satisfies readonly WorldClockLocation[];

const getPart = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string => parts.find((part) => part.type === type)?.value ?? "";

const formatAtLocation = (
  date: Date,
  timeZone: string,
  format: WorldClockFormat,
): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: format === "24-hour" ? "h23" : "h12",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const datePart = `${getPart(parts, "year")}-${getPart(parts, "month")}-${getPart(parts, "day")}`;
  const timePart = `${getPart(parts, "hour")}:${getPart(parts, "minute")}:${getPart(parts, "second")}`;
  return format === "12-hour"
    ? `${datePart} ${timePart} ${getPart(parts, "dayPeriod")}`
    : `${datePart} ${timePart}`;
};

export const formatWorldClock = (
  instant: string,
  format: WorldClockFormat,
  locations: readonly WorldClockLocation[] = worldClockLocations,
): string => {
  const date = new Date(instant);
  if (Number.isNaN(date.getTime()))
    simpleError("instant", "Instant must be a valid date and time.");

  try {
    return locations
      .map(
        ({ name, timeZone }) =>
          `${name}: ${formatAtLocation(date, timeZone, format)}`,
      )
      .join("\n");
  } catch {
    return simpleError(
      "locations",
      "Every location must use a valid IANA time zone.",
    );
  }
};

export const worldClockExample = {
  input: { format: "24-hour", instant: "2026-08-05T23:05:09Z" },
  output: {
    times:
      "UTC: 2026-08-05 23:05:09\nLos Angeles: 2026-08-05 16:05:09\nNew York: 2026-08-05 19:05:09\nSao Paulo: 2026-08-05 20:05:09\nLondon: 2026-08-06 00:05:09\nBerlin: 2026-08-06 01:05:09\nJohannesburg: 2026-08-06 01:05:09\nDubai: 2026-08-06 03:05:09\nNew Delhi: 2026-08-06 04:35:09\nSingapore: 2026-08-06 07:05:09\nTokyo: 2026-08-06 08:05:09\nSydney: 2026-08-06 09:05:09",
  },
} satisfies ToolExample<
  { readonly format: WorldClockFormat; readonly instant: string },
  { readonly times: string }
>;

export const worldClockTool = createSimpleTool({
  id: "world-clock",
  title: "World Clock",
  description: "Compare one instant across major world time zones.",
  inputs: [
    {
      format: "date-time",
      id: "instant",
      kind: "string",
      label: "Instant",
    },
    {
      enum: ["24-hour", "12-hour"],
      id: "format",
      kind: "string",
      label: "Clock format",
    },
  ],
  outputs: [
    {
      format: "world-clock",
      id: "times",
      kind: "string",
      label: "World times",
    },
  ],
  calculate: (input) => ({
    times: formatWorldClock(
      input.instant as string,
      input.format as WorldClockFormat,
    ),
  }),
});

export const runWorldClock = worldClockTool.execute;
export default worldClockTool;
