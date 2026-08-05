import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CalendarDateFormat = "de-DE" | "en-US" | "iso";
export type ParsedCalendarDate = {
  readonly day: number;
  readonly iso: string;
  readonly month: number;
  readonly timestamp: number;
  readonly year: number;
};

const createDate = (
  year: number,
  month: number,
  day: number,
): ParsedCalendarDate | null => {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return null;
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return null;
  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { day, iso, month, timestamp: date.getTime(), year };
};

export const parseCalendarDate = (
  text: string,
  format: CalendarDateFormat,
): ParsedCalendarDate | null => {
  const patterns = {
    iso: /^(\d{4})-(\d{2})-(\d{2})$/,
    "en-US": /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    "de-DE": /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
  } as const;
  const match = patterns[format]?.exec(text.trim());
  if (!match) return null;
  if (format === "iso")
    return createDate(Number(match[1]), Number(match[2]), Number(match[3]));
  if (format === "en-US")
    return createDate(Number(match[3]), Number(match[1]), Number(match[2]));
  return createDate(Number(match[3]), Number(match[2]), Number(match[1]));
};

export const dateParserExample = {
  input: { format: "iso", text: "2026-08-11" },
  output: {
    day: 11,
    iso: "2026-08-11",
    month: 8,
    timestamp: 1786406400000,
    year: 2026,
  },
} satisfies ToolExample<
  { readonly format: CalendarDateFormat; readonly text: string },
  ParsedCalendarDate
>;

export const dateParserTool = createSimpleTool({
  id: "parse/date",
  title: "Date Parser",
  description:
    "Parse a calendar date in an explicit format into normalized date fields.",
  inputs: [
    { id: "text", kind: "string", label: "Date" },
    {
      enum: ["iso", "en-US", "de-DE"],
      id: "format",
      kind: "string",
      label: "Date format",
    },
  ],
  outputs: [
    { id: "iso", kind: "string", label: "ISO date" },
    { id: "year", kind: "integer", label: "Year" },
    { id: "month", kind: "integer", label: "Month" },
    { id: "day", kind: "integer", label: "Day" },
    { id: "timestamp", kind: "integer", label: "UTC timestamp" },
  ],
  calculate: (input) => {
    const result = parseCalendarDate(
      input.text as string,
      input.format as CalendarDateFormat,
    );
    if (!result)
      simpleError(
        "text",
        "Enter a valid calendar date in the selected format.",
      );
    return result;
  },
});

export const runDateParser = dateParserTool.execute;
export default dateParserTool;
