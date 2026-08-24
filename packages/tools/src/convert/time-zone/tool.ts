import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  availableTimeZones,
  formatInstantInTimeZone,
  localDateTimeToInstant,
  resolveTimeZone,
  type LocalTimeDisambiguation,
  type TimeFormat,
} from "../../core/time-zone.js";

export type TimeZoneConverterInput = {
  readonly disambiguation?: LocalTimeDisambiguation;
  readonly format?: TimeFormat;
  readonly localDateTime: string;
  readonly sourceTimeZone: string;
  readonly timeZones?: readonly string[];
};

export type TimeZoneConverterOutput = {
  readonly conversions: readonly string[];
  readonly instantUtc: string;
  readonly sourceTimeZone: string;
};

export const convertTimeZones = (
  input: TimeZoneConverterInput,
): TimeZoneConverterOutput => {
  const source = resolveTimeZone(input.sourceTimeZone, "sourceTimeZone");
  const instant = localDateTimeToInstant(
    input.localDateTime,
    source,
    input.disambiguation ?? "earlier",
  );
  const requestedZones =
    input.timeZones && input.timeZones.length > 0
      ? input.timeZones
      : availableTimeZones();
  const seen = new Set<string>();
  const conversions: string[] = [];
  for (const enteredZone of requestedZones) {
    const zone = resolveTimeZone(enteredZone, "timeZones");
    const key = `${zone.canonicalName}:${zone.fixedOffsetMinutes ?? "iana"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    conversions.push(
      `${zone.canonicalName} — ${formatInstantInTimeZone(
        instant,
        zone,
        input.format ?? "24-hour",
      )}`,
    );
  }
  if (conversions.length === 0)
    return simpleError(
      "timeZones",
      "At least one destination time zone is required.",
      "empty_time_zones",
    );
  return {
    conversions,
    instantUtc: new Date(instant).toISOString(),
    sourceTimeZone: source.canonicalName,
  };
};

export const timeZoneConverterExample = {
  input: {
    format: "24-hour",
    localDateTime: "2026-01-15 6:00 PM",
    sourceTimeZone: "PST",
    timeZones: ["America/Los_Angeles", "Europe/Berlin", "Asia/Kolkata"],
  },
  output: {
    conversions: [
      "America/Los_Angeles — 2026-01-15 18:00:00 (UTC-08:00)",
      "Europe/Berlin — 2026-01-16 03:00:00 (UTC+01:00)",
      "Asia/Calcutta — 2026-01-16 07:30:00 (UTC+05:30)",
    ],
    instantUtc: "2026-01-16T02:00:00.000Z",
    sourceTimeZone: "PST",
  },
} satisfies ToolExample<TimeZoneConverterInput, TimeZoneConverterOutput>;

export const timeZoneConverterTool = createSimpleTool({
  id: "convert/time-zone",
  title: "Time Zone Converter",
  description:
    "Convert a dated local time from an IANA zone, common abbreviation, city, or UTC offset to every runtime-supported IANA time zone.",
  inputs: [
    {
      description:
        "Dated local clock time, for example 2026-01-15 6:00 PM. A date is required because daylight-saving offsets change.",
      id: "localDateTime",
      kind: "string",
      label: "Local date and time",
    },
    {
      description:
        "IANA zone, supported city, abbreviation such as PST or CET, or UTC offset such as UTC+05:30.",
      format: "iana-time-zone-or-offset",
      id: "sourceTimeZone",
      kind: "string",
      label: "Source time zone",
    },
    {
      default: "24-hour",
      enum: ["24-hour", "12-hour"],
      id: "format",
      kind: "string",
      label: "Clock format",
    },
    {
      default: "earlier",
      description:
        "How to resolve a local clock time repeated when daylight saving ends.",
      enum: ["earlier", "later", "reject"],
      id: "disambiguation",
      kind: "string",
      label: "Repeated-time handling",
    },
    {
      default: [],
      description:
        "Optional destination zones. Leave empty to convert to every IANA zone supported by the runtime.",
      id: "timeZones",
      kind: "stringList",
      label: "Destination time zones",
    },
  ],
  outputs: [
    {
      format: "date-time",
      id: "instantUtc",
      kind: "string",
      label: "UTC instant",
    },
    {
      format: "iana-time-zone-or-offset",
      id: "sourceTimeZone",
      kind: "string",
      label: "Resolved source time zone",
    },
    {
      format: "zoned-date-time-list",
      id: "conversions",
      kind: "stringList",
      label: "Converted times",
    },
  ],
  calculate: (input) =>
    convertTimeZones({
      disambiguation: input.disambiguation as LocalTimeDisambiguation,
      format: input.format as TimeFormat,
      localDateTime: input.localDateTime as string,
      sourceTimeZone: input.sourceTimeZone as string,
      timeZones: input.timeZones as readonly string[],
    }),
});

export const runTimeZoneConverter = timeZoneConverterTool.execute;
export default timeZoneConverterTool;
