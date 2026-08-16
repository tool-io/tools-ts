import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type AgeInput = {
  readonly asOfDate: string;
  readonly birthDate: string;
};

export type AgeOutput = {
  readonly days: number;
  readonly months: number;
  readonly years: number;
};

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const ageInputSchema = {
  additionalProperties: false,
  properties: {
    asOfDate: {
      description: "Reference date as YYYY-MM-DD.",
      format: "date",
      type: "string",
    },
    birthDate: {
      description: "Birth date as YYYY-MM-DD.",
      format: "date",
      type: "string",
    },
  },
  required: ["birthDate", "asOfDate"],
  type: "object",
} as const;

export const ageOutputSchema = {
  additionalProperties: false,
  properties: {
    days: {
      description: "Remaining whole days after whole months.",
      minimum: 0,
      maximum: 30,
      type: "integer",
    },
    months: {
      description: "Remaining whole months after whole years.",
      minimum: 0,
      maximum: 11,
      type: "integer",
    },
    years: {
      description: "Completed years.",
      minimum: 0,
      type: "integer",
    },
  },
  required: ["years", "months", "days"],
  type: "object",
} as const;

export const ageExample = {
  input: { asOfDate: "2026-08-17", birthDate: "1990-06-15" },
  output: { days: 2, months: 2, years: 36 },
} satisfies ToolExample<AgeInput, AgeOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseIsoDate = (
  field: string,
  value: string,
):
  { year: number; month: number; day: number; utcDays: number } | ToolIssue => {
  const codePrefix = field === "asOfDate" ? "as_of_date" : "birth_date";
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match)
    return {
      code: `${codePrefix}_invalid`,
      field,
      message: `${field} must be a YYYY-MM-DD date.`,
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
      code: `${codePrefix}_impossible`,
      field,
      message: `${field} must be a real calendar date.`,
    };
  return { year, month, day, utcDays: Math.floor(utc / 86_400_000) };
};

const daysInUtcMonth = (year: number, month1Based: number): number => {
  const nextMonthStart = Date.UTC(year, month1Based, 1);
  return new Date(nextMonthStart - 1).getUTCDate();
};

export const isAgeOutput = (value: unknown): value is AgeOutput =>
  isRecord(value) &&
  Number.isSafeInteger(value.years) &&
  Number.isSafeInteger(value.months);

export const calculateAge = (input: unknown): ToolResult<AgeOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["asOfDate", "birthDate"]);
  const FIELD_CODES: Readonly<Record<string, string>> = {
    asOfDate: "as_of_date",
    birthDate: "birth_date",
  };
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const field of ["birthDate", "asOfDate"] as const) {
    const value = input[field];
    if (typeof value !== "string") {
      issues.push({
        code: `${FIELD_CODES[field]}_required`,
        field,
        message: `${field} is required.`,
      });
      continue;
    }
    const parsed = parseIsoDate(field, value);
    if ("code" in parsed) issues.push(parsed);
  }
  if (issues.length > 0) return invalidInput(issues);

  const birth = parseIsoDate("birthDate", input.birthDate as string) as {
    year: number;
    month: number;
    day: number;
    utcDays: number;
  };
  const asOf = parseIsoDate("asOfDate", input.asOfDate as string) as {
    year: number;
    month: number;
    day: number;
    utcDays: number;
  };
  if (asOf.utcDays < birth.utcDays)
    return invalidInput([
      {
        code: "range_reversed",
        field: "asOfDate",
        message: "asOfDate must not precede birthDate.",
      },
    ]);

  // Total whole months between the two dates, then anchor on the birth
  // day-of-month (clamped to the target month) to count leftover days.
  let monthsTotal = (asOf.year - birth.year) * 12 + (asOf.month - birth.month);
  const anchorFor = (
    year: number,
    month1Based: number,
  ): { utcDays: number } => {
    const day = Math.min(birth.day, daysInUtcMonth(year, month1Based));
    return {
      utcDays: Date.UTC(year, month1Based - 1, day) / 86_400_000,
    };
  };
  let anchor = anchorFor(asOf.year, asOf.month);
  if (anchor.utcDays > asOf.utcDays) {
    monthsTotal -= 1;
    const previousMonth = asOf.month === 1 ? 12 : asOf.month - 1;
    const previousYear = asOf.month === 1 ? asOf.year - 1 : asOf.year;
    anchor = anchorFor(previousYear, previousMonth);
  }
  const days = Math.round(asOf.utcDays - anchor.utcDays);
  const years = Math.floor(monthsTotal / 12);
  const months = monthsTotal - years * 12;

  return toolSuccess({ days, months, years });
};

export const ageTool = defineTool<AgeInput, AgeOutput>({
  contractVersion: 1,
  description:
    "Compute completed years, months, and days between a birth date and a reference date.",
  discovery: {
    aliases: ["age-calculator"],
    keywords: ["age", "birthday", "calendar"],
  },
  execute: calculateAge,
  execution: { kind: "pure" },
  id: "date/age",
  inputSchema: ageInputSchema,
  outputSchema: ageOutputSchema,
  ports: {
    inputs: [
      {
        description: "Birth date.",
        id: "birthDate",
        label: "Birth date",
        required: true,
        valueType: { format: "date", type: "string" },
      },
      {
        description: "Reference date for the calculation.",
        id: "asOfDate",
        label: "As of",
        required: true,
        valueType: { format: "date", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Completed years.",
        id: "years",
        label: "Years",
        valueType: { format: "count", type: "integer", unit: "years" },
      },
      {
        description: "Whole months beyond the years.",
        id: "months",
        label: "Months",
        valueType: { format: "count", type: "integer", unit: "months" },
      },
      {
        description: "Whole days beyond the months.",
        id: "days",
        label: "Days",
        valueType: { format: "count", type: "integer", unit: "days" },
      },
    ],
  },
  title: "Age Calculator",
});

export const runAge = ageTool.execute;
export default ageTool;
