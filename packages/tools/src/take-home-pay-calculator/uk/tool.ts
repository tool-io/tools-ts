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
  ukIncomeTaxBrackets2026,
  ukPersonalAllowance2026,
} from "./rules-2026.js";

export type UKTakeHomePayInput = {
  readonly grossPay: number;
  readonly location?: "england";
  readonly payPeriod?: PayPeriod;
  readonly pensionRate?: number;
};

export const ukTakeHomePayExample = {
  input: { grossPay: 50_000, location: "england", payPeriod: "yearly" },
} satisfies ToolExample<UKTakeHomePayInput, TakeHomePayOutput>;

export const calculateUKTakeHomePay = (
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
  const pensionRate = input.pensionRate ?? 0;
  const location = input.location ?? "england";
  const issues: ToolIssue[] = [
    ...unknownFieldIssues(input, [
      "grossPay",
      "location",
      "payPeriod",
      "pensionRate",
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
    typeof pensionRate !== "number" ||
    !Number.isFinite(pensionRate) ||
    pensionRate < 0 ||
    pensionRate > 100
  )
    issues.push({
      code: "invalid_pension_rate",
      field: "pensionRate",
      message: "Pension rate must be between 0 and 100 percent.",
    });
  if (location !== "england")
    issues.push({
      code: "invalid_location",
      field: "location",
      message: "The supported location is England, Wales or Northern Ireland.",
    });
  if (issues.length > 0 || !normalized) return invalidInput(issues);

  const annual = normalized.annual;
  const contributionRate = pensionRate as number;
  const pension = annual * (contributionRate / 100);
  const adjustedIncome = Math.max(0, annual - pension);
  const personalAllowance = ukPersonalAllowance2026(adjustedIncome);
  const taxableIncome = Math.max(0, adjustedIncome - personalAllowance);
  const incomeTaxResult = calculateProgressiveTax({
    brackets: ukIncomeTaxBrackets2026(personalAllowance),
    income: taxableIncome,
  });
  if (!incomeTaxResult.ok) return incomeTaxResult;
  const nationalInsurance =
    Math.max(0, Math.min(annual, 50_270) - 12_570) * 0.08 +
    Math.max(0, annual - 50_270) * 0.02;

  return toolSuccess(
    createTakeHomePayOutput({
      annual,
      assumptions: [
        "England, Wales or Northern Ireland",
        "Standard personal allowance",
        "National Insurance category A",
        `${contributionRate}% pension`,
        "No student loan",
      ],
      country: "United Kingdom",
      currency: "GBP",
      deductions: [
        { amount: pension, code: "pension", label: "Pension contribution" },
        {
          amount: incomeTaxResult.output.tax,
          code: "paye_income_tax",
          label: "PAYE income tax estimate",
        },
        {
          amount: nationalInsurance,
          code: "national_insurance",
          label: "Employee National Insurance",
        },
      ],
      locale: "en-GB",
      location: "England",
      period: normalized.period,
      ruleVersion: "uk-2026-27.1",
      taxYear: "2026–27",
    }),
  );
};

export const ukTakeHomePayTool = defineTool<
  UKTakeHomePayInput,
  TakeHomePayOutput
>({
  contractVersion: 1,
  description:
    "Estimate UK take-home pay after PAYE income tax and employee National Insurance.",
  execute: calculateUKTakeHomePay,
  execution: { kind: "pure" },
  id: "take-home-pay-calculator/uk",
  inputSchema: {
    additionalProperties: false,
    properties: {
      ...takeHomePayBaseInputProperties,
      location: { default: "england", enum: ["england"], type: "string" },
      pensionRate: { default: 0, maximum: 100, minimum: 0, type: "number" },
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
        valueType: { format: "uk-payroll-location", type: "string" },
      },
      {
        id: "pensionRate",
        label: "Pension contribution",
        required: false,
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
    ],
    outputs: takeHomePayOutputPorts,
  },
  title: "UK Take-Home Pay Calculator",
});

export default ukTakeHomePayTool;
