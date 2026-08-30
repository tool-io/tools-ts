import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const parseDate = (value: string, field: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    simpleError(
      field,
      "Date must use YYYY-MM-DD format.",
      "date_format_invalid",
    );
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    simpleError(field, "Date is not a valid calendar date.", "date_invalid");
  return date;
};

export type WatchAppraisalAgeInput = {
  readonly appraisalDate: string;
  readonly asOfDate: string;
  readonly maximumAllowedAgeDays: number;
};

export type WatchAppraisalAgeOutput = {
  readonly ageDays: number;
  readonly daysPastAllowedAge: number;
  readonly withinCallerAgeLimit: boolean;
};

export const screenWatchAppraisalAge = (
  input: WatchAppraisalAgeInput,
): WatchAppraisalAgeOutput => {
  const appraisal = parseDate(input.appraisalDate, "appraisalDate");
  const asOf = parseDate(input.asOfDate, "asOfDate");
  if (asOf.getTime() < appraisal.getTime())
    simpleError(
      "asOfDate",
      "As-of date must not precede the appraisal date.",
      "date_order_invalid",
    );
  if (
    !Number.isSafeInteger(input.maximumAllowedAgeDays) ||
    input.maximumAllowedAgeDays < 0
  )
    simpleError(
      "maximumAllowedAgeDays",
      "Maximum appraisal age must be a nonnegative safe integer in days.",
      "age_limit_invalid",
    );
  const ageDays = Math.floor(
    (asOf.getTime() - appraisal.getTime()) / 86_400_000,
  );
  return {
    ageDays,
    daysPastAllowedAge: Math.max(0, ageDays - input.maximumAllowedAgeDays),
    withinCallerAgeLimit: ageDays <= input.maximumAllowedAgeDays,
  };
};

export const watchAppraisalAgeExample = {
  input: {
    appraisalDate: "2024-01-01",
    asOfDate: "2025-01-01",
    maximumAllowedAgeDays: 366,
  },
  output: {
    ageDays: 366,
    daysPastAllowedAge: 0,
    withinCallerAgeLimit: true,
  },
} satisfies ToolExample<WatchAppraisalAgeInput, WatchAppraisalAgeOutput>;

export const watchAppraisalAgeTool = createSimpleTool({
  calculate: (input) =>
    screenWatchAppraisalAge({
      appraisalDate: input.appraisalDate as string,
      asOfDate: input.asOfDate as string,
      maximumAllowedAgeDays: input.maximumAllowedAgeDays as number,
    }),
  description:
    "Screen an appraisal's age against an explicit policy limit; no universal insurance update interval is assumed.",
  id: "horology/watch-appraisal-age-threshold-screen",
  inputs: [
    {
      format: "date",
      id: "appraisalDate",
      kind: "string",
      label: "Appraisal date",
    },
    { id: "asOfDate", kind: "string", label: "As-of date" },
    {
      id: "maximumAllowedAgeDays",
      kind: "integer",
      label: "Maximum allowed appraisal age",
      minimum: 0,
      unit: "d",
    },
  ],
  outputs: [
    {
      id: "ageDays",
      kind: "integer",
      label: "Appraisal age",
      minimum: 0,
      unit: "d",
    },
    {
      id: "daysPastAllowedAge",
      kind: "integer",
      label: "Days past allowed age",
      minimum: 0,
      unit: "d",
    },
    {
      id: "withinCallerAgeLimit",
      kind: "boolean",
      label: "Within caller appraisal-age limit",
    },
  ],
  title: "Watch Appraisal Age Threshold Screen",
});

export const runWatchAppraisalAge = watchAppraisalAgeTool.execute;
export default watchAppraisalAgeTool;
