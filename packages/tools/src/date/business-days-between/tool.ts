import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BusinessDaysBetweenInput = {
  /** Inclusive lower bound as YYYY-MM-DD. */
  readonly endDate: string;
  /** Holiday dates (YYYY-MM-DD) subtracted when they fall on a weekday. */
  readonly holidays?: readonly string[];
  /** Exclusive upper bound as YYYY-MM-DD. */
  readonly startDate: string;
};

export type BusinessDaysBetweenOutput = {
  readonly businessDayCount: number;
  readonly holidayCount: number;
  readonly totalDays: number;
};

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const businessDaysBetweenInputSchema = {
  additionalProperties: false,
  properties: {
    endDate: {
      description: "Exclusive upper bound as YYYY-MM-DD.",
      format: "date",
      type: "string",
    },
    holidays: {
      description: "Holiday dates subtracted when they land on weekdays.",
      items: { format: "date", type: "string" },
      type: "array",
    },
    startDate: {
      description: "Inclusive lower bound as YYYY-MM-DD.",
      format: "date",
      type: "string",
    },
  },
  required: ["startDate", "endDate"],
  type: "object",
} as const;

export const businessDaysBetweenOutputSchema = {
  additionalProperties: false,
  properties: {
    businessDayCount: {
      description: "Weekdays in range after holiday subtraction.",
      minimum: 0,
      type: "integer",
    },
    holidayCount: {
      description: "Holidays that fell on weekdays inside the range.",
      minimum: 0,
      type: "integer",
    },
    totalDays: {
      description: "Calendar days covered by the half-open range.",
      minimum: 0,
      type: "integer",
    },
  },
  required: ["businessDayCount", "holidayCount", "totalDays"],
  type: "object",
} as const;

export const businessDaysBetweenExample = {
  input: { endDate: "2026-08-21", startDate: "2026-08-17" },
  output: { businessDayCount: 4, holidayCount: 0, totalDays: 4 },
} satisfies ToolExample<BusinessDaysBetweenInput, BusinessDaysBetweenOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseIsoDate = (
  field: string,
  value: string,
): { utcDays: number } | { issue: ToolIssue } => {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match)
    return {
      issue: {
        code: `${field}_invalid`,
        field,
        message: `${field} must be a YYYY-MM-DD date.`,
      },
    };
  const [, year, month, day] = match;
  const utc = Date.UTC(Number(year), Number(month) - 1, Number(day));
  const parsed = new Date(utc);
  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() !== Number(month) - 1 ||
    parsed.getUTCDate() !== Number(day)
  )
    return {
      issue: {
        code: `${field}_impossible`,
        field,
        message: `${field} must be a real calendar date.`,
      },
    };
  return { utcDays: Math.floor(utc / 86_400_000) };
};

export const isBusinessDaysBetweenOutput = (
  value: unknown,
): value is BusinessDaysBetweenOutput =>
  isRecord(value) &&
  Number.isSafeInteger(value.businessDayCount) &&
  Number.isSafeInteger(value.totalDays);

export const calculateBusinessDaysBetween = (
  input: unknown,
): ToolResult<BusinessDaysBetweenOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["endDate", "holidays", "startDate"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const [field, code] of [
    ["startDate", "start_date"],
    ["endDate", "end_date"],
  ] as const) {
    const value = input[field];
    if (value === undefined)
      issues.push({
        code: `${code}_required`,
        field,
        message: `${field} is required.`,
      });
    else if (typeof value !== "string")
      issues.push({
        code: `${code}_invalid`,
        field,
        message: `${field} must be a YYYY-MM-DD date.`,
      });
  }
  if (issues.length > 0) return invalidInput(issues);

  const startParsed = parseIsoDate("startDate", input.startDate as string);
  if ("issue" in startParsed) return invalidInput([startParsed.issue]);
  const endParsed = parseIsoDate("endDate", input.endDate as string);
  if ("issue" in endParsed) return invalidInput([endParsed.issue]);
  if (endParsed.utcDays < startParsed.utcDays)
    return invalidInput([
      {
        code: "range_reversed",
        field: "endDate",
        message: "endDate must not precede startDate.",
      },
    ]);

  let holidays: readonly string[] = [];
  const rawHolidays = input.holidays;
  if (rawHolidays !== undefined) {
    if (!Array.isArray(rawHolidays))
      return invalidInput([
        {
          code: "holidays_invalid",
          field: "holidays",
          message: "holidays must be an array of YYYY-MM-DD dates.",
        },
      ]);
    const limitIssue = resourceLimitIssue(
      "generatedValues",
      rawHolidays.length,
      "holidays",
    );
    if (limitIssue) return invalidInput([limitIssue]);
    for (const [index, entry] of rawHolidays.entries())
      if (typeof entry !== "string" || !ISO_DATE_PATTERN.test(entry))
        return invalidInput([
          {
            code: "holiday_invalid",
            field: `holidays.${index}`,
            message: `holidays.${index} must be a YYYY-MM-DD date.`,
          },
        ]);
    holidays = rawHolidays as readonly string[];
  }

  const totalDays = endParsed.utcDays - startParsed.utcDays;
  const spanLimit = resourceLimitIssue(
    "iterations",
    Math.max(totalDays, 1),
    "dateRange",
  );
  if (spanLimit) return invalidInput([spanLimit]);

  const holidaySet = new Set(holidays);
  let businessDayCount = 0;
  let holidayCount = 0;
  for (let day = startParsed.utcDays; day < endParsed.utcDays; day += 1) {
    const weekday = ((day % 7) + 11) % 7; // 1970-01-01 was a Thursday.
    const isWeekday = weekday <= 4;
    if (!isWeekday) continue;
    if (holidaySet.size > 0 && holidaySet.has(formatUtcDay(day))) {
      holidayCount += 1;
      continue;
    }
    businessDayCount += 1;
  }

  return toolSuccess({ businessDayCount, holidayCount, totalDays });
};

const formatUtcDay = (utcDays: number): string => {
  const date = new Date(utcDays * 86_400_000);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}-${dayOfMonth}`;
};

export const businessDaysBetweenTool = defineTool<
  BusinessDaysBetweenInput,
  BusinessDaysBetweenOutput
>({
  contractVersion: 1,
  description:
    "Count weekdays in a half-open date range, optionally subtracting supplied holidays.",
  discovery: {
    aliases: ["workdays-calculator", "working-days-between"],
    keywords: ["business", "calendar", "days", "workdays"],
  },
  execute: calculateBusinessDaysBetween,
  execution: { kind: "pure" },
  id: "date/business-days-between",
  inputSchema: businessDaysBetweenInputSchema,
  outputSchema: businessDaysBetweenOutputSchema,
  ports: {
    inputs: [
      {
        description: "Inclusive lower bound.",
        id: "startDate",
        label: "Start date",
        required: true,
        valueType: { format: "date", type: "string" },
      },
      {
        description: "Exclusive upper bound.",
        id: "endDate",
        label: "End date",
        required: true,
        valueType: { format: "date", type: "string" },
      },
      {
        description: "Holidays to subtract on weekdays.",
        id: "holidays",
        label: "Holidays",
        valueType: {
          format: "date",
          items: { format: "date", type: "string" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        description: "Weekdays remaining after holidays.",
        id: "businessDayCount",
        label: "Business days",
        valueType: { format: "count", type: "integer", unit: "days" },
      },
      {
        description: "Calendar days in the half-open range.",
        id: "totalDays",
        label: "Total days",
        valueType: { format: "count", type: "integer", unit: "days" },
      },
      {
        description: "Holidays applied on weekdays.",
        id: "holidayCount",
        label: "Holidays applied",
        valueType: { format: "count", type: "integer" },
      },
    ],
  },
  title: "Business Days Between",
});

export const runBusinessDaysBetween = businessDaysBetweenTool.execute;
export default businessDaysBetweenTool;
