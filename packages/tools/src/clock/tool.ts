import type { ToolExample } from "../core/example.js";
import { createSimpleTool, simpleError } from "../core/simple.js";

export type ClockFormat = "12-hour" | "24-hour";

const getPart = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string => parts.find((part) => part.type === type)?.value ?? "";

export const formatClock = (
  instant: string,
  timeZone: string,
  format: ClockFormat,
): string => {
  const date = new Date(instant);
  if (Number.isNaN(date.getTime()))
    simpleError("instant", "Instant must be a valid date and time.");

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hourCycle: format === "24-hour" ? "h23" : "h12",
      minute: "2-digit",
      second: "2-digit",
      timeZone,
    }).formatToParts(date);
    const time = `${getPart(parts, "hour")}:${getPart(parts, "minute")}:${getPart(parts, "second")}`;
    return format === "12-hour"
      ? `${time} ${getPart(parts, "dayPeriod")}`
      : time;
  } catch {
    return simpleError("timeZone", "Time zone must be a valid IANA time zone.");
  }
};

export const clockExample = {
  input: {
    format: "24-hour",
    instant: "2026-08-05T16:05:09Z",
    timeZone: "Europe/Berlin",
  },
  output: { time: "18:05:09" },
} satisfies ToolExample<
  {
    readonly format: ClockFormat;
    readonly instant: string;
    readonly timeZone: string;
  },
  { readonly time: string }
>;

export const clockTool = createSimpleTool({
  id: "clock",
  title: "Clock",
  description: "Format an instant as local clock time in an IANA time zone.",
  inputs: [
    {
      format: "date-time",
      id: "instant",
      kind: "string",
      label: "Instant",
    },
    {
      format: "iana-time-zone",
      id: "timeZone",
      kind: "string",
      label: "Time zone",
    },
    {
      enum: ["24-hour", "12-hour"],
      id: "format",
      kind: "string",
      label: "Clock format",
    },
  ],
  outputs: [{ format: "time", id: "time", kind: "string", label: "Time" }],
  calculate: (input) => ({
    time: formatClock(
      input.instant as string,
      input.timeZone as string,
      input.format as ClockFormat,
    ),
  }),
});

export const runClock = clockTool.execute;
export default clockTool;
