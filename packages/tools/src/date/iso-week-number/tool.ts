import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type IsoWeekNumberInput = {
  readonly date: string;
};

export type IsoWeekNumberOutput = {
  readonly week: number;
  readonly weekYear: number;
};

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const isoWeekNumberInputSchema = {
  additionalProperties: false,
  properties: {
    date: {
      description: "Date as YYYY-MM-DD.",
      format: "date",
      type: "string",
    },
  },
  required: ["date"],
  type: "object",
} as const;

export const isoWeekNumberOutputSchema = {
  additionalProperties: false,
  properties: {
    week: {
      description: "ISO-8601 week number, 1 to 53.",
      maximum: 53,
      minimum: 1,
      type: "integer",
    },
    weekYear: {
      description:
        "Year the ISO week belongs to, which may differ from the calendar year.",
      minimum: 1,
      type: "integer",
    },
  },
  required: ["week", "weekYear"],
  type: "object",
} as const;

export const isoWeekNumberExample = {
  input: { date: "2026-08-17" },
  output: { week: 34, weekYear: 2026 },
} satisfies ToolExample<IsoWeekNumberInput, IsoWeekNumberOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseIsoDate = (
  value: string,
):
  | { utcDays: number; thursdayUtcDays: number; weekYear: number }
  | ToolIssue => {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match)
    return {
      code: "date_invalid",
      field: "date",
      message: "date must be a YYYY-MM-DD date.",
    };
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = Date.UTC(year, month - 1, day);
  const parsed = new Date(utc);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  )
    return {
      code: "date_impossible",
      field: "date",
      message: "date must be a real calendar date.",
    };
  // Shift to the Thursday of the same ISO week; its year is the week-year.
  const weekday = (parsed.getUTCDay() + 6) % 7; // Monday = 0.
  const thursday = new Date(utc + (3 - weekday) * 86_400_000);
  return {
    utcDays: Math.floor(utc / 86_400_000),
    thursdayUtcDays: Math.floor(thursday.getTime() / 86_400_000),
    weekYear: thursday.getUTCFullYear(),
  };
};

const firstThursdayUtcDays = (year: number): number => {
  const jan4 = Date.UTC(year, 0, 4);
  const weekday = (new Date(jan4).getUTCDay() + 6) % 7;
  return Math.floor(jan4 / 86_400_000) - weekday;
};

export const isIsoWeekNumberOutput = (
  value: unknown,
): value is IsoWeekNumberOutput =>
  isRecord(value) &&
  Number.isSafeInteger(value.week) &&
  Number.isSafeInteger(value.weekYear);

export const calculateIsoWeekNumber = (
  input: unknown,
): ToolResult<IsoWeekNumberOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "date")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawDate = input.date;
  if (rawDate === undefined || typeof rawDate !== "string")
    return invalidInput([
      ...issues,
      {
        code: "date_required",
        field: "date",
        message: "date is required as a YYYY-MM-DD string.",
      },
    ]);
  const parsed = parseIsoDate(rawDate);
  if ("code" in parsed) return invalidInput([...issues, parsed]);
  if (issues.length > 0) return invalidInput(issues);

  const week =
    Math.round(
      (parsed.thursdayUtcDays - firstThursdayUtcDays(parsed.weekYear)) / 7,
    ) + 1;
  return toolSuccess({ week, weekYear: parsed.weekYear });
};

export const isoWeekNumberTool = defineTool<
  IsoWeekNumberInput,
  IsoWeekNumberOutput
>({
  contractVersion: 1,
  description:
    "Return the ISO-8601 week number and week year for a calendar date.",
  discovery: {
    aliases: ["week-number-calculator"],
    keywords: ["calendar", "iso", "week"],
  },
  execute: calculateIsoWeekNumber,
  execution: { kind: "pure" },
  id: "date/iso-week-number",
  inputSchema: isoWeekNumberInputSchema,
  outputSchema: isoWeekNumberOutputSchema,
  ports: {
    inputs: [
      {
        description: "Calendar date.",
        id: "date",
        label: "Date",
        required: true,
        valueType: { format: "date", type: "string" },
      },
    ],
    outputs: [
      {
        description: "ISO week number.",
        id: "week",
        label: "Week",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Year that owns the ISO week.",
        id: "weekYear",
        label: "Week year",
        valueType: { format: "date-year", type: "integer", unit: "years" },
      },
    ],
  },
  title: "ISO Week Number",
});

export const runIsoWeekNumber = isoWeekNumberTool.execute;
export default isoWeekNumberTool;
