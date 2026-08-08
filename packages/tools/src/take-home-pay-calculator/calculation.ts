import type { ToolIssue } from "../core/result.js";
import {
  payPeriods,
  periodsPerYear,
  type PayPeriod,
  type TakeHomePayDeduction,
  type TakeHomePayOutput,
} from "./types.js";

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isPayPeriod = (value: unknown): value is PayPeriod =>
  typeof value === "string" &&
  (payPeriods as readonly string[]).includes(value);

export type NormalizedPay = {
  readonly annual: number;
  readonly period: PayPeriod;
};

export const normalizePay = (
  grossPay: unknown,
  payPeriod: unknown,
): NormalizedPay | null => {
  if (
    typeof grossPay !== "number" ||
    !Number.isFinite(grossPay) ||
    grossPay < 0 ||
    !isPayPeriod(payPeriod)
  )
    return null;
  const annual = grossPay * periodsPerYear[payPeriod];
  if (!Number.isFinite(annual)) return null;
  return {
    annual: Object.is(annual, -0) ? 0 : annual,
    period: payPeriod,
  };
};

export const unknownFieldIssues = (
  input: Readonly<Record<string, unknown>>,
  allowed: readonly string[],
): readonly ToolIssue[] => {
  const allowedFields = new Set(allowed);
  return Object.keys(input)
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      code: "unknown_field",
      field,
      message: `${field} is not a supported input field.`,
    }));
};

export const createTakeHomePayOutput = ({
  annual,
  assumptions,
  country,
  currency,
  deductions,
  locale,
  location,
  period,
  ruleVersion,
  taxYear,
  warnings = [],
}: {
  readonly annual: number;
  readonly assumptions: readonly string[];
  readonly country: string;
  readonly currency: string;
  readonly deductions: readonly TakeHomePayDeduction[];
  readonly locale: string;
  readonly location: string;
  readonly period: PayPeriod;
  readonly ruleVersion: string;
  readonly taxYear: string;
  readonly warnings?: readonly string[];
}): TakeHomePayOutput => {
  const normalizedDeductions = deductions.map((deduction) => ({
    ...deduction,
    amount: Math.max(0, deduction.amount),
  }));
  const deductionTotal = normalizedDeductions.reduce(
    (total, deduction) => total + deduction.amount,
    0,
  );
  const netAnnual = Math.max(0, annual - deductionTotal);
  return {
    assumptions,
    country,
    currency,
    deductions: normalizedDeductions,
    grossAnnual: annual,
    locale,
    location,
    netAnnual,
    netForPeriod: netAnnual / periodsPerYear[period],
    period,
    ruleVersion,
    taxYear,
    warnings,
  };
};

export const takeHomePayBaseInputProperties = {
  grossPay: {
    description: "Gross pay for the selected pay period.",
    minimum: 0,
    type: "number",
  },
  payPeriod: {
    description: "Period represented by the gross pay input.",
    enum: payPeriods,
    type: "string",
  },
} as const;

export const takeHomePayOutputSchema = {
  additionalProperties: false,
  properties: {
    assumptions: { items: { type: "string" }, type: "array" },
    country: { type: "string" },
    currency: { type: "string" },
    deductions: {
      items: {
        additionalProperties: false,
        properties: {
          amount: { minimum: 0, type: "number" },
          code: { type: "string" },
          label: { type: "string" },
        },
        required: ["amount", "code", "label"],
        type: "object",
      },
      type: "array",
    },
    grossAnnual: { minimum: 0, type: "number" },
    locale: { type: "string" },
    location: { type: "string" },
    netAnnual: { minimum: 0, type: "number" },
    netForPeriod: { minimum: 0, type: "number" },
    period: { enum: payPeriods, type: "string" },
    ruleVersion: { type: "string" },
    taxYear: { type: "string" },
    warnings: { items: { type: "string" }, type: "array" },
  },
  required: [
    "assumptions",
    "country",
    "currency",
    "deductions",
    "grossAnnual",
    "locale",
    "location",
    "netAnnual",
    "netForPeriod",
    "period",
    "ruleVersion",
    "taxYear",
    "warnings",
  ],
  type: "object",
} as const;

export const takeHomePayOutputPorts = [
  {
    id: "result",
    label: "Take-home pay estimate",
    path: [],
    valueType: { format: "payroll/take-home-pay", type: "object" as const },
  },
] as const;
