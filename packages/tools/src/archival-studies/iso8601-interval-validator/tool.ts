import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Iso8601IntervalValidatorInput = {
  readonly interval: string;
};

export type Iso8601IntervalValidatorOutput = {
  readonly valid: boolean;
  readonly startKind: "date" | "datetime" | "duration" | "unknown";
  readonly endKind: "date" | "datetime" | "duration" | "unknown";
  readonly reason: string;
};

type ComponentKind = Iso8601IntervalValidatorOutput["startKind"];

const DATE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;
const DATETIME =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(?:Z|[+-](\d{2}):(\d{2}))?$/;
const CALENDAR_DURATION =
  /^P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/;
const WEEK_DURATION = /^P\d+W$/;

const daysInMonth = (year: number, month: number): number => {
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

const validDate = (year: string, month?: string, day?: string): boolean => {
  if (month === undefined) return true;
  const monthNumber = Number(month);
  if (monthNumber < 1 || monthNumber > 12) return false;
  if (day === undefined) return true;
  const dayNumber = Number(day);
  return dayNumber >= 1 && dayNumber <= daysInMonth(Number(year), monthNumber);
};

const classifyComponent = (value: string): ComponentKind => {
  if (WEEK_DURATION.test(value) || CALENDAR_DURATION.test(value))
    return "duration";
  const datetimeMatch = DATETIME.exec(value);
  if (datetimeMatch !== null) {
    if (
      validDate(datetimeMatch[1], datetimeMatch[2], datetimeMatch[3]) &&
      Number(datetimeMatch[4]) <= 23 &&
      Number(datetimeMatch[5]) <= 59 &&
      (datetimeMatch[6] === undefined || Number(datetimeMatch[6]) <= 59) &&
      (datetimeMatch[8] === undefined || Number(datetimeMatch[8]) <= 23) &&
      (datetimeMatch[9] === undefined || Number(datetimeMatch[9]) <= 59)
    )
      return "datetime";
    return "unknown";
  }
  const match = DATE.exec(value);
  if (match !== null && validDate(match[1], match[2], match[3])) return "date";
  return "unknown";
};

export const calculateIso8601IntervalValidator = (
  input: Iso8601IntervalValidatorInput,
): Iso8601IntervalValidatorOutput => {
  const value = input.interval.trim();
  if (value.length === 0)
    simpleError("interval", "Interval must not be empty.", "invalid_interval");
  if (input.interval !== input.interval.trim())
    return {
      valid: false,
      startKind: "unknown",
      endKind: "unknown",
      reason: "interval contains surrounding whitespace",
    };
  const parts = value.split("/");
  if (parts.length !== 2 || parts.some((part) => part.length === 0))
    return {
      valid: false,
      startKind: "unknown",
      endKind: "unknown",
      reason: "interval must contain exactly one '/' separator",
    };
  const [start, end] = parts;
  const startKind = classifyComponent(start);
  const endKind = classifyComponent(end);
  if (startKind === "unknown" || endKind === "unknown")
    return {
      valid: false,
      startKind,
      endKind,
      reason: "endpoint is not a valid ISO 8601 date, datetime or duration",
    };
  if (startKind === "duration" && endKind === "duration")
    return {
      valid: false,
      startKind,
      endKind,
      reason: "both endpoints cannot be durations",
    };
  return { valid: true, startKind, endKind, reason: "" };
};

export const iso8601IntervalValidatorExample = {
  input: { interval: "1876-03-02/P1Y" },
  output: { valid: true, startKind: "date", endKind: "duration", reason: "" },
} satisfies ToolExample<
  Iso8601IntervalValidatorInput,
  Iso8601IntervalValidatorOutput
>;

export const iso8601IntervalValidatorTool = createSimpleTool({
  id: "archival-studies/iso8601-interval-validator",
  title: "ISO 8601 Date Interval Format Validator",
  description:
    "Validate a practical ISO 8601 interval subset of the form start/end. It checks Gregorian calendar dates (including leap years), clock and UTC-offset ranges, reduced-precision dates, and non-mixed calendar or week durations; it does not compare endpoint chronology.",
  inputs: [
    {
      description: "Candidate interval string such as 1900-01/2000-12.",
      id: "interval",
      kind: "string",
      label: "Interval",
    },
  ],
  outputs: [
    {
      description: "True when both endpoints are valid and compatible.",
      id: "valid",
      kind: "boolean",
      label: "Valid",
    },
    {
      description: "Kind of the start endpoint.",
      enum: ["date", "datetime", "duration", "unknown"],
      id: "startKind",
      kind: "string",
      label: "Start kind",
    },
    {
      description: "Kind of the end endpoint.",
      enum: ["date", "datetime", "duration", "unknown"],
      id: "endKind",
      kind: "string",
      label: "End kind",
    },
    {
      description: "Explanation when invalid; empty when valid.",
      id: "reason",
      kind: "string",
      label: "Reason",
    },
  ],
  calculate: (input) =>
    calculateIso8601IntervalValidator({
      interval: input.interval as string,
    }),
});

export const runIso8601IntervalValidator = iso8601IntervalValidatorTool.execute;
export default iso8601IntervalValidatorTool;
