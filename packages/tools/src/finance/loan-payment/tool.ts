import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type LoanPaymentInput = {
  readonly annualRatePercent: number;
  readonly months: number;
  readonly principal: number;
};

export type LoanPaymentOutput = {
  readonly monthlyPayment: number;
  readonly totalInterest: number;
  readonly totalPaid: number;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const loanPaymentInputSchema = {
  additionalProperties: false,
  properties: {
    annualRatePercent: {
      description:
        "Nominal annual interest rate in percent; 0 means an interest-free loan.",
      minimum: 0,
      type: "number",
    },
    months: {
      description: "Loan term in whole months.",
      minimum: 1,
      type: "integer",
    },
    principal: {
      description: "Amount borrowed.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["principal", "annualRatePercent", "months"],
  type: "object",
} as const;

export const loanPaymentOutputSchema = {
  additionalProperties: false,
  properties: {
    monthlyPayment: {
      description: "Fixed payment rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
    totalInterest: {
      description: "Total interest over the term, rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
    totalPaid: {
      description: "Principal plus interest, rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["monthlyPayment", "totalInterest", "totalPaid"],
  type: "object",
} as const;

export const loanPaymentExample = {
  input: { annualRatePercent: 6, months: 360, principal: 120000 },
  output: { monthlyPayment: 719.46, totalInterest: 139005.83, totalPaid: 259005.83 },
} satisfies ToolExample<LoanPaymentInput, LoanPaymentOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isLoanPaymentOutput = (
  value: unknown,
): value is LoanPaymentOutput =>
  isRecord(value) &&
  typeof value.monthlyPayment === "number" &&
  Number.isFinite(value.monthlyPayment);

export const calculateLoanPayment = (
  input: unknown,
): ToolResult<LoanPaymentOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["annualRatePercent", "months", "principal"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const [field, value] of [
    ["principal", input.principal],
    ["annualRatePercent", input.annualRatePercent],
    ["months", input.months],
  ] as const)
    if (value === undefined)
      issues.push({
        code: `${field}_required`,
        field,
        message: `${field} is required.`,
      });
    else if (field === "months") {
      if (!Number.isSafeInteger(value) || (value as number) < 1)
        issues.push({
          code: "months_invalid",
          field,
          message: "months must be a positive safe integer.",
        });
    } else if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      (value as number) < 0 ||
      (field === "principal" && (value as number) <= 0)
    )
      issues.push({
        code: `${field}_invalid`,
        field,
        message:
          field === "principal"
            ? "principal must be a positive finite number."
            : "annualRatePercent must be a nonnegative finite number.",
      });

  if (issues.length > 0) return invalidInput(issues);

  const principal = input.principal as number;
  const rate = (input.annualRatePercent as number) / 100 / 12;
  const months = input.months as number;
  const monthlyPayment =
    rate === 0
      ? principal / months
      : (principal * rate) / (1 - Math.pow(1 + rate, -months));
  const totalPaid = monthlyPayment * months;
  return toolSuccess({
    monthlyPayment: round2(monthlyPayment),
    totalInterest: round2(totalPaid - principal),
    totalPaid: round2(totalPaid),
  });
};

export const loanPaymentTool = defineTool<LoanPaymentInput, LoanPaymentOutput>({
  contractVersion: 1,
  description:
    "Compute the fixed monthly payment, total interest, and total paid for an amortizing loan.",
  discovery: {
    aliases: ["emi-calculator", "loan-calculator", "mortgage-payment"],
    keywords: ["amortization", "interest", "loan", "mortgage", "payment"],
  },
  execute: calculateLoanPayment,
  execution: { kind: "pure" },
  id: "finance/loan-payment",
  inputSchema: loanPaymentInputSchema,
  outputSchema: loanPaymentOutputSchema,
  ports: {
    inputs: [
      {
        description: "Amount borrowed.",
        id: "principal",
        label: "Principal",
        required: true,
        valueType: { format: "currency-amount", type: "number" },
      },
      {
        description: "Nominal annual interest rate in percent.",
        id: "annualRatePercent",
        label: "Annual rate",
        required: true,
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
      {
        description: "Term in whole months.",
        id: "months",
        label: "Months",
        required: true,
        valueType: { format: "duration", type: "integer", unit: "mo" },
      },
    ],
    outputs: [
      {
        description: "Fixed payment per month.",
        id: "monthlyPayment",
        label: "Monthly payment",
        valueType: { format: "currency-amount", type: "number" },
      },
      {
        description: "Interest paid across the whole term.",
        id: "totalInterest",
        label: "Total interest",
        valueType: { format: "currency-amount", type: "number" },
      },
      {
        description: "Principal plus interest.",
        id: "totalPaid",
        label: "Total paid",
        valueType: { format: "currency-amount", type: "number" },
      },
    ],
  },
  title: "Loan Payment",
});

export const runLoanPayment = loanPaymentTool.execute;
export default loanPaymentTool;
