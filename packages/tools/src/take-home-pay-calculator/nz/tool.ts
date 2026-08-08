import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import { calculateProgressiveTax } from "../../tax/progressive/tool.js";
import {
  createTakeHomePayOutput,
  isRecord,
  normalizePay,
  takeHomePayBaseInputProperties,
  takeHomePayOutputPorts,
  takeHomePayOutputSchema,
  unknownFieldIssues,
} from "../calculation.js";
import type { PayPeriod, TakeHomePayOutput } from "../types.js";
import {
  newZealandPayrollRules2026,
  newZealandTaxBrackets2026,
} from "./rules-2026.js";

export type NewZealandTakeHomePayInput = {
  readonly grossPay: number;
  readonly kiwiSaverRate?: number;
  readonly location?: "auckland";
  readonly payPeriod?: PayPeriod;
  readonly studentLoan?: boolean;
};

export const newZealandTakeHomePayExample = {
  input: { grossPay: 80_000, location: "auckland", payPeriod: "yearly" },
} satisfies ToolExample<NewZealandTakeHomePayInput, TakeHomePayOutput>;

export const calculateNewZealandTakeHomePay = (
  input: unknown,
): ToolResult<TakeHomePayOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const normalized = normalizePay(input.grossPay, input.payPeriod ?? "yearly");
  const kiwiSaverRate = input.kiwiSaverRate ?? 0;
  const studentLoan = input.studentLoan ?? false;
  const location = input.location ?? "auckland";
  const issues: ToolIssue[] = [
    ...unknownFieldIssues(input, [
      "grossPay",
      "kiwiSaverRate",
      "location",
      "payPeriod",
      "studentLoan",
    ]),
  ];
  if (!normalized)
    issues.push({
      code: "invalid_pay",
      field: "grossPay",
      message:
        "Gross pay and pay period must produce finite nonnegative annual pay.",
    });
  if (
    typeof kiwiSaverRate !== "number" ||
    !Number.isFinite(kiwiSaverRate) ||
    kiwiSaverRate < 0 ||
    kiwiSaverRate > 100
  )
    issues.push({
      code: "invalid_kiwisaver_rate",
      field: "kiwiSaverRate",
      message: "KiwiSaver rate must be between 0 and 100 percent.",
    });
  if (typeof studentLoan !== "boolean")
    issues.push({
      code: "invalid_student_loan",
      field: "studentLoan",
      message: "Student loan must be true or false.",
    });
  if (location !== "auckland")
    issues.push({
      code: "invalid_location",
      field: "location",
      message: "The supported location is Auckland.",
    });
  if (issues.length > 0 || !normalized) return invalidInput(issues);

  const annual = normalized.annual;
  const contributionRate = kiwiSaverRate as number;
  const incomeTaxResult = calculateProgressiveTax({
    brackets: newZealandTaxBrackets2026,
    income: annual,
  });
  if (!incomeTaxResult.ok) return incomeTaxResult;
  const rules = newZealandPayrollRules2026;
  const accLevy =
    Math.min(annual, rules.accAssessmentCeiling) * rules.accEarnersLevyRate;
  const kiwiSaver = annual * (contributionRate / 100);
  const studentLoanAmount = studentLoan
    ? Math.max(0, annual - rules.studentLoanThreshold) * rules.studentLoanRate
    : 0;

  return toolSuccess(
    createTakeHomePayOutput({
      annual,
      assumptions: [
        "Auckland",
        "New Zealand tax resident",
        "Primary M tax code",
        `${contributionRate}% KiwiSaver`,
        studentLoan ? "Student loan" : "No student loan",
        "No other deductions",
      ],
      country: "New Zealand",
      currency: "NZD",
      deductions: [
        {
          amount: incomeTaxResult.output.tax,
          code: "paye_income_tax",
          label: "PAYE income tax",
        },
        {
          amount: accLevy,
          code: "acc_earners_levy",
          label: "ACC earners’ levy",
        },
        {
          amount: kiwiSaver,
          code: "kiwisaver",
          label: "KiwiSaver contribution",
        },
        {
          amount: studentLoanAmount,
          code: "student_loan",
          label: "Student-loan repayment",
        },
      ],
      locale: "en-NZ",
      location: "Auckland",
      period: normalized.period,
      ruleVersion: "nz-2026-27.1",
      taxYear: "2026–27",
    }),
  );
};

export const newZealandTakeHomePayTool = defineTool<
  NewZealandTakeHomePayInput,
  TakeHomePayOutput
>({
  contractVersion: 1,
  description:
    "Estimate New Zealand take-home pay after PAYE, the ACC earners’ levy, and selected deductions.",
  execute: calculateNewZealandTakeHomePay,
  execution: { kind: "pure" },
  id: "take-home-pay-calculator/nz",
  inputSchema: {
    additionalProperties: false,
    properties: {
      ...takeHomePayBaseInputProperties,
      kiwiSaverRate: { default: 0, maximum: 100, minimum: 0, type: "number" },
      location: { default: "auckland", enum: ["auckland"], type: "string" },
      studentLoan: { default: false, type: "boolean" },
    },
    required: ["grossPay"],
    type: "object",
  },
  outputSchema: takeHomePayOutputSchema,
  ports: {
    inputs: [
      {
        id: "grossPay",
        label: "Gross pay",
        required: true,
        valueType: { format: "money", type: "number" },
      },
      {
        id: "payPeriod",
        label: "Pay period",
        required: false,
        valueType: { format: "pay-period", type: "string" },
      },
      {
        id: "location",
        label: "Location",
        required: false,
        valueType: { format: "nz-payroll-location", type: "string" },
      },
      {
        id: "kiwiSaverRate",
        label: "KiwiSaver contribution",
        required: false,
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
      {
        id: "studentLoan",
        label: "Student loan",
        required: false,
        valueType: { type: "boolean" },
      },
    ],
    outputs: takeHomePayOutputPorts,
  },
  title: "New Zealand Take-Home Pay Calculator",
});

export default newZealandTakeHomePayTool;
