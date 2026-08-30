import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const parseInstant = (value: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value))
    simpleError(
      "utcDateTime",
      "Instant must use YYYY-MM-DDTHH:mm:ssZ format.",
      "instant_format_invalid",
    );
  const date = new Date(value);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString() !== `${value.slice(0, -1)}.000Z`
  )
    simpleError(
      "utcDateTime",
      "Instant is not a valid UTC date and time.",
      "instant_invalid",
    );
  return date;
};

const partValue = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string => parts.find((part) => part.type === type)?.value ?? "";

export type WorldTimerZoneInput = {
  readonly ianaTimeZone: string;
  readonly utcDateTime: string;
};

export type WorldTimerZoneOutput = {
  readonly ianaTimeZone: string;
  readonly localDateTime: string;
  readonly utcOffsetLabel: string;
  readonly utcOffsetMinutes: number;
  readonly worldTimerCaution: string;
};

export const resolveWorldTimerZoneOffset = (
  input: WorldTimerZoneInput,
): WorldTimerZoneOutput => {
  const instant = parseInstant(input.utcDateTime);
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-CA", {
      hour12: false,
      timeZone: input.ianaTimeZone,
      timeZoneName: "longOffset",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(instant);
  } catch {
    return simpleError(
      "ianaTimeZone",
      "IANA time-zone identifier is not supported.",
      "invalid_iana_time_zone",
    );
  }
  const year = Number(partValue(parts, "year"));
  const month = Number(partValue(parts, "month"));
  const day = Number(partValue(parts, "day"));
  const hour = Number(partValue(parts, "hour")) % 24;
  const minute = Number(partValue(parts, "minute"));
  const second = Number(partValue(parts, "second"));
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const utcOffsetMinutes = (localAsUtc - instant.getTime()) / 60_000;
  return {
    ianaTimeZone: input.ianaTimeZone,
    localDateTime: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`,
    utcOffsetLabel: partValue(parts, "timeZoneName"),
    utcOffsetMinutes,
    worldTimerCaution:
      "A mechanical world-timer city disc encodes the maker's chosen standard-time and daylight-saving convention. Resolve the named IANA zone for the relevant date instead of treating a printed city offset as timeless.",
  };
};

export const worldTimerZoneExample = {
  input: {
    ianaTimeZone: "Etc/UTC",
    utcDateTime: "2025-01-15T12:00:00Z",
  },
  output: {
    ianaTimeZone: "Etc/UTC",
    localDateTime: "2025-01-15 12:00:00",
    utcOffsetLabel: "GMT",
    utcOffsetMinutes: 0,
    worldTimerCaution:
      "A mechanical world-timer city disc encodes the maker's chosen standard-time and daylight-saving convention. Resolve the named IANA zone for the relevant date instead of treating a printed city offset as timeless.",
  },
} satisfies ToolExample<WorldTimerZoneInput, WorldTimerZoneOutput>;

export const worldTimerZoneTool = createSimpleTool({
  calculate: (input) =>
    resolveWorldTimerZoneOffset({
      ianaTimeZone: input.ianaTimeZone as string,
      utcDateTime: input.utcDateTime as string,
    }),
  description:
    "Resolve an IANA time-zone identifier to its UTC offset and local date-time at an explicit UTC instant, including daylight-saving changes in the runtime time-zone database.",
  id: "horology/iana-zone-offset-at-instant",
  inputs: [
    { id: "ianaTimeZone", kind: "string", label: "IANA time-zone identifier" },
    {
      format: "date-time",
      id: "utcDateTime",
      kind: "string",
      label: "UTC instant",
    },
  ],
  outputs: [
    { id: "ianaTimeZone", kind: "string", label: "IANA time-zone identifier" },
    { id: "localDateTime", kind: "string", label: "Resolved local date-time" },
    {
      id: "utcOffsetLabel",
      kind: "string",
      label: "Resolved UTC offset label",
    },
    {
      id: "utcOffsetMinutes",
      kind: "number",
      label: "Resolved UTC offset",
      unit: "min",
    },
    {
      id: "worldTimerCaution",
      kind: "string",
      label: "Mechanical world-timer caution",
    },
  ],
  title: "IANA Zone Offset at Instant",
});

export const runWorldTimerZone = worldTimerZoneTool.execute;
export default worldTimerZoneTool;
