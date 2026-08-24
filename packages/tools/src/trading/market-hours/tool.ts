import { formatPlainDate, parsePlainDate } from "../../core/date.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import {
  formatInstantInTimeZone,
  localDateTimeToInstant,
  resolveTimeZone,
  type TimeFormat,
} from "../../core/time-zone.js";

export type TradingSession = {
  readonly closeTime: string;
  readonly name: string;
  readonly openTime: string;
  readonly timeZone: string;
};

export type MarketHoursInput = {
  readonly date: string;
  readonly displayTimeZone: string;
  readonly format?: TimeFormat;
};

export type MarketHoursOutput = {
  readonly displayTimeZone: string;
  readonly overlaps: readonly string[];
  readonly scheduleNote: string;
  readonly sessions: readonly string[];
};

type SessionInterval = {
  readonly close: number;
  readonly definition: TradingSession;
  readonly open: number;
};

export const majorForexSessions = [
  {
    closeTime: "17:00",
    name: "Sydney",
    openTime: "08:00",
    timeZone: "Australia/Sydney",
  },
  {
    closeTime: "18:00",
    name: "Tokyo",
    openTime: "09:00",
    timeZone: "Asia/Tokyo",
  },
  {
    closeTime: "17:00",
    name: "London",
    openTime: "08:00",
    timeZone: "Europe/London",
  },
  {
    closeTime: "17:00",
    name: "New York",
    openTime: "08:00",
    timeZone: "America/New_York",
  },
] as const satisfies readonly TradingSession[];

const scheduleNote =
  "Regular weekday forex session windows; public holidays, exceptional closures, and broker-specific schedules are not included.";

const minutesOfDay = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const nextDate = (date: string): string =>
  formatPlainDate(parsePlainDate(date) + 86_400_000);

const intervalFor = (
  date: string,
  definition: TradingSession,
): SessionInterval => {
  const zone = resolveTimeZone(definition.timeZone);
  const open = localDateTimeToInstant(
    `${date} ${definition.openTime}`,
    zone,
    "earlier",
    "date",
  );
  const closeDate =
    minutesOfDay(definition.closeTime) <= minutesOfDay(definition.openTime)
      ? nextDate(date)
      : date;
  const close = localDateTimeToInstant(
    `${closeDate} ${definition.closeTime}`,
    zone,
    "later",
    "date",
  );
  return { close, definition, open };
};

export const calculateMarketHours = (
  input: MarketHoursInput,
  definitions: readonly TradingSession[] = majorForexSessions,
): MarketHoursOutput => {
  const dateTimestamp = parsePlainDate(input.date);
  const displayZone = resolveTimeZone(input.displayTimeZone, "displayTimeZone");
  const format = input.format ?? "24-hour";
  const weekday = new Date(dateTimestamp).getUTCDay();
  const isWeekend = weekday === 0 || weekday === 6;

  if (isWeekend)
    return {
      displayTimeZone: displayZone.canonicalName,
      overlaps: [
        "No regular session overlaps: the selected trading date is a weekend.",
      ],
      scheduleNote,
      sessions: definitions.map(
        ({ name, timeZone }) => `${name} (${timeZone}) — Closed for weekend`,
      ),
    };

  const intervals = definitions.map((definition) =>
    intervalFor(input.date, definition),
  );
  const sessions = intervals.map(
    ({ close, definition, open }) =>
      `${definition.name} (${definition.timeZone}) — ${formatInstantInTimeZone(
        open,
        displayZone,
        format,
      )} – ${formatInstantInTimeZone(close, displayZone, format)}`,
  );
  const overlapIntervals: Array<{
    readonly close: number;
    readonly label: string;
    readonly open: number;
  }> = [];
  for (let left = 0; left < intervals.length; left += 1) {
    for (let right = left + 1; right < intervals.length; right += 1) {
      const open = Math.max(intervals[left].open, intervals[right].open);
      const close = Math.min(intervals[left].close, intervals[right].close);
      if (open >= close) continue;
      overlapIntervals.push({
        close,
        label: `${intervals[left].definition.name} / ${intervals[right].definition.name}`,
        open,
      });
    }
  }
  overlapIntervals.sort(
    (left, right) => left.open - right.open || left.close - right.close,
  );
  const overlaps = overlapIntervals.map(
    ({ close, label, open }) =>
      `${label} — ${formatInstantInTimeZone(
        open,
        displayZone,
        format,
      )} – ${formatInstantInTimeZone(close, displayZone, format)}`,
  );
  return {
    displayTimeZone: displayZone.canonicalName,
    overlaps:
      overlaps.length > 0
        ? overlaps
        : ["No regular session overlaps occur on the selected date."],
    scheduleNote,
    sessions,
  };
};

export const marketHoursExample = {
  input: {
    date: "2026-01-15",
    displayTimeZone: "UTC",
    format: "24-hour",
  },
  output: {
    displayTimeZone: "UTC",
    overlaps: [
      "Sydney / Tokyo — 2026-01-15 00:00:00 (UTC+00:00) – 2026-01-15 06:00:00 (UTC+00:00)",
      "Tokyo / London — 2026-01-15 08:00:00 (UTC+00:00) – 2026-01-15 09:00:00 (UTC+00:00)",
      "London / New York — 2026-01-15 13:00:00 (UTC+00:00) – 2026-01-15 17:00:00 (UTC+00:00)",
    ],
    scheduleNote,
    sessions: [
      "Sydney (Australia/Sydney) — 2026-01-14 21:00:00 (UTC+00:00) – 2026-01-15 06:00:00 (UTC+00:00)",
      "Tokyo (Asia/Tokyo) — 2026-01-15 00:00:00 (UTC+00:00) – 2026-01-15 09:00:00 (UTC+00:00)",
      "London (Europe/London) — 2026-01-15 08:00:00 (UTC+00:00) – 2026-01-15 17:00:00 (UTC+00:00)",
      "New York (America/New_York) — 2026-01-15 13:00:00 (UTC+00:00) – 2026-01-15 22:00:00 (UTC+00:00)",
    ],
  },
} satisfies ToolExample<MarketHoursInput, MarketHoursOutput>;

export const marketHoursTool = createSimpleTool({
  id: "trading/market-hours",
  title: "Trading Market Hours",
  description:
    "Show the regular Sydney, Tokyo, London, and New York forex sessions and their date-specific overlaps in a selected time zone.",
  inputs: [
    {
      description:
        "Trading date in YYYY-MM-DD format. The date determines daylight-saving offsets and weekend closures.",
      format: "date",
      id: "date",
      kind: "string",
      label: "Trading date",
    },
    {
      description:
        "IANA zone, supported city, common abbreviation, or UTC offset used to display every session.",
      format: "iana-time-zone-or-offset",
      id: "displayTimeZone",
      kind: "string",
      label: "Display time zone",
    },
    {
      default: "24-hour",
      enum: ["24-hour", "12-hour"],
      id: "format",
      kind: "string",
      label: "Clock format",
    },
  ],
  outputs: [
    {
      format: "iana-time-zone-or-offset",
      id: "displayTimeZone",
      kind: "string",
      label: "Resolved display time zone",
    },
    {
      format: "market-session-list",
      id: "sessions",
      kind: "stringList",
      label: "Trading sessions",
    },
    {
      format: "market-session-overlap-list",
      id: "overlaps",
      kind: "stringList",
      label: "Session overlaps",
    },
    {
      id: "scheduleNote",
      kind: "string",
      label: "Schedule coverage",
    },
  ],
  calculate: (input) =>
    calculateMarketHours({
      date: input.date as string,
      displayTimeZone: input.displayTimeZone as string,
      format: input.format as TimeFormat,
    }),
});

export const runMarketHours = marketHoursTool.execute;
export default marketHoursTool;
