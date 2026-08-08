import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
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
  japanBasicExemption2026,
  japanEmploymentIncome2026,
  japanNationalIncomeTax2026,
} from "./rules-2026.js";

export type JapanTakeHomePayInput = {
  readonly ageBand?: "under-40" | "40-64";
  readonly dependents?: number;
  readonly grossPay: number;
  readonly location?: "tokyo";
  readonly payPeriod?: PayPeriod;
};

export const japanTakeHomePayExample = {
  input: { grossPay: 5_000_000, location: "tokyo", payPeriod: "yearly" },
} satisfies ToolExample<JapanTakeHomePayInput, TakeHomePayOutput>;

export const calculateJapanTakeHomePay = (
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
  const dependents = input.dependents ?? 0;
  const ageBand = input.ageBand ?? "under-40";
  const location = input.location ?? "tokyo";
  const issues: ToolIssue[] = [
    ...unknownFieldIssues(input, [
      "ageBand",
      "dependents",
      "grossPay",
      "location",
      "payPeriod",
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
    typeof dependents !== "number" ||
    !Number.isSafeInteger(dependents) ||
    dependents < 0
  )
    issues.push({
      code: "invalid_dependents",
      field: "dependents",
      message: "Dependents must be a nonnegative integer.",
    });
  if (ageBand !== "under-40" && ageBand !== "40-64")
    issues.push({
      code: "invalid_age_band",
      field: "ageBand",
      message: "Age band must be under-40 or 40-64.",
    });
  if (location !== "tokyo")
    issues.push({
      code: "invalid_location",
      field: "location",
      message: "The supported location is Tokyo.",
    });
  if (issues.length > 0 || !normalized) return invalidInput(issues);

  const annual = normalized.annual;
  const dependentCount = dependents as number;
  const healthInsurance = Math.min(annual, 16_680_000) * 0.04925;
  const employeePension = Math.min(annual, 7_800_000) * 0.0915;
  const employmentInsurance = annual * 0.005;
  const childSupportContribution = annual * 0.00115;
  const nursingCare =
    ageBand === "40-64" ? Math.min(annual, 16_680_000) * 0.0081 : 0;
  const socialInsurance =
    healthInsurance +
    employeePension +
    employmentInsurance +
    childSupportContribution +
    nursingCare;
  const earnedIncome = japanEmploymentIncome2026(annual);
  const taxableIncome = Math.max(
    0,
    earnedIncome -
      japanBasicExemption2026(earnedIncome) -
      socialInsurance -
      dependentCount * 380_000,
  );
  const incomeTax = japanNationalIncomeTax2026(taxableIncome);
  const reconstructionSurtax = incomeTax * 0.021;
  const residentTax = taxableIncome * 0.1 + 5_000;

  return toolSuccess(
    createTakeHomePayOutput({
      annual,
      assumptions: [
        "Tokyo",
        "Resident employee",
        `${dependentCount} dependents`,
        ageBand === "40-64" ? "Age 40–64" : "Under age 40",
        "No bonuses",
        "Standard employment-income and basic deductions",
      ],
      country: "Japan",
      currency: "JPY",
      deductions: [
        {
          amount: incomeTax,
          code: "national_income_tax",
          label: "National income tax estimate",
        },
        {
          amount: reconstructionSurtax,
          code: "reconstruction_surtax",
          label: "Reconstruction special income tax",
        },
        {
          amount: residentTax,
          code: "resident_tax",
          label: "Resident tax estimate",
        },
        {
          amount: healthInsurance,
          code: "health_insurance",
          label: "Health insurance",
        },
        {
          amount: employeePension,
          code: "employee_pension",
          label: "Employees’ pension",
        },
        {
          amount: employmentInsurance,
          code: "employment_insurance",
          label: "Employment insurance",
        },
        {
          amount: childSupportContribution,
          code: "child_support_contribution",
          label: "Child and childcare support contribution",
        },
        {
          amount: nursingCare,
          code: "nursing_care_insurance",
          label: "Nursing-care insurance",
        },
      ],
      locale: "ja-JP",
      location: "Tokyo",
      period: normalized.period,
      ruleVersion: "jp-2026.1",
      taxYear: "2026 estimate",
    }),
  );
};

export const japanTakeHomePayTool = defineTool<
  JapanTakeHomePayInput,
  TakeHomePayOutput
>({
  contractVersion: 1,
  description:
    "Estimate Japanese take-home pay after income taxes and employee social-insurance contributions.",
  execute: calculateJapanTakeHomePay,
  execution: { kind: "pure" },
  id: "take-home-pay-calculator/jp",
  inputSchema: {
    additionalProperties: false,
    properties: {
      ...takeHomePayBaseInputProperties,
      ageBand: {
        default: "under-40",
        enum: ["under-40", "40-64"],
        type: "string",
      },
      dependents: { default: 0, minimum: 0, type: "integer" },
      location: { default: "tokyo", enum: ["tokyo"], type: "string" },
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
        valueType: { format: "jp-payroll-location", type: "string" },
      },
      {
        id: "dependents",
        label: "Tax dependents",
        required: false,
        valueType: { format: "count", type: "integer" },
      },
      {
        id: "ageBand",
        label: "Age band",
        required: false,
        valueType: { format: "age-band", type: "string" },
      },
    ],
    outputs: takeHomePayOutputPorts,
  },
  title: "Japan Take-Home Pay Calculator",
});

export default japanTakeHomePayTool;
