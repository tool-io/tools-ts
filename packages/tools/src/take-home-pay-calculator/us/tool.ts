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
  californiaRows2026,
  taxFromRows,
  usFederalRows2026,
} from "./rules-2026.js";

export type USFilingStatus = "single" | "married" | "head";
export type USTakeHomePayInput = {
  readonly dependentCredit?: number;
  readonly filingStatus?: USFilingStatus;
  readonly grossPay: number;
  readonly location?: "ca-sf" | "federal";
  readonly payPeriod?: PayPeriod;
  readonly preTax?: number;
};

export const usTakeHomePayExample = {
  input: { grossPay: 50_000, location: "ca-sf", payPeriod: "yearly" },
} satisfies ToolExample<USTakeHomePayInput, TakeHomePayOutput>;

export const calculateUSTakeHomePay = (
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
  const filingStatus = input.filingStatus ?? "single";
  const dependentCredit = input.dependentCredit ?? 0;
  const preTax = input.preTax ?? 0;
  const location = input.location ?? "ca-sf";
  const issues: ToolIssue[] = [
    ...unknownFieldIssues(input, [
      "dependentCredit",
      "filingStatus",
      "grossPay",
      "location",
      "payPeriod",
      "preTax",
    ]),
  ];
  if (!normalized)
    issues.push({
      code: "invalid_pay",
      field: "grossPay",
      message:
        "Gross pay and pay period must produce finite nonnegative annual pay.",
    });
  if (typeof filingStatus !== "string" || !(filingStatus in usFederalRows2026))
    issues.push({
      code: "invalid_filing_status",
      field: "filingStatus",
      message: "Filing status is not supported.",
    });
  for (const [field, value] of [
    ["dependentCredit", dependentCredit],
    ["preTax", preTax],
  ] as const)
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
      issues.push({
        code: "nonnegative_number_required",
        field,
        message: `${field} must be a finite nonnegative number.`,
      });
  if (location !== "ca-sf" && location !== "federal")
    issues.push({
      code: "invalid_location",
      field: "location",
      message: "Location must be ca-sf or federal.",
    });
  if (issues.length > 0 || !normalized) return invalidInput(issues);

  const annual = normalized.annual;
  const status = filingStatus as USFilingStatus;
  const annualDependentCredit = dependentCredit as number;
  const annualPreTax = preTax as number;
  const standardDeduction = status === "married" ? 12_900 : 8_600;
  const federalTaxable = Math.max(0, annual - annualPreTax - standardDeduction);
  const federalIncomeTax = Math.max(
    0,
    taxFromRows(federalTaxable, usFederalRows2026[status]) -
      annualDependentCredit,
  );
  const socialSecurity = Math.min(annual, 184_500) * 0.062;
  const medicare = annual * 0.0145 + Math.max(0, annual - 200_000) * 0.009;
  const includeCalifornia = location === "ca-sf";
  const californiaTaxable = Math.max(0, annual - annualPreTax - 5_706);
  const californiaIncomeTax = includeCalifornia
    ? taxFromRows(californiaTaxable, californiaRows2026)
    : 0;
  const californiaSdi = includeCalifornia ? annual * 0.013 : 0;
  const locationName = includeCalifornia
    ? "San Francisco, California"
    : "United States — federal only";

  return toolSuccess(
    createTakeHomePayOutput({
      annual,
      assumptions: [
        `2026 ${status} filing profile`,
        "Standard W-4",
        "No additional withholding",
        locationName,
      ],
      country: "United States",
      currency: "USD",
      deductions: [
        {
          amount: annualPreTax,
          code: "pre_tax_deductions",
          label: "Pre-tax deductions",
        },
        {
          amount: federalIncomeTax,
          code: "federal_income_tax",
          label: "Federal withholding",
        },
        {
          amount: socialSecurity,
          code: "social_security",
          label: "Social Security",
        },
        { amount: medicare, code: "medicare", label: "Medicare" },
        {
          amount: californiaIncomeTax,
          code: "california_income_tax",
          label: "California income-tax withholding",
        },
        {
          amount: californiaSdi,
          code: "california_sdi",
          label: "California SDI",
        },
      ],
      locale: "en-US",
      location: locationName,
      period: normalized.period,
      ruleVersion: "us-2026.1",
      taxYear: "2026",
    }),
  );
};

export const usTakeHomePayTool = defineTool<
  USTakeHomePayInput,
  TakeHomePayOutput
>({
  contractVersion: 1,
  description:
    "Estimate US take-home pay after federal payroll withholding and supported location deductions.",
  execute: calculateUSTakeHomePay,
  execution: { kind: "pure" },
  id: "take-home-pay-calculator/us",
  inputSchema: {
    additionalProperties: false,
    properties: {
      ...takeHomePayBaseInputProperties,
      dependentCredit: { default: 0, minimum: 0, type: "number" },
      filingStatus: {
        default: "single",
        enum: ["single", "married", "head"],
        type: "string",
      },
      location: {
        default: "ca-sf",
        enum: ["ca-sf", "federal"],
        type: "string",
      },
      preTax: { default: 0, minimum: 0, type: "number" },
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
        valueType: { format: "us-payroll-location", type: "string" },
      },
      {
        id: "filingStatus",
        label: "Filing status",
        required: false,
        valueType: { format: "us-filing-status", type: "string" },
      },
      {
        id: "dependentCredit",
        label: "Annual W-4 credits",
        required: false,
        valueType: { format: "money", type: "number" },
      },
      {
        id: "preTax",
        label: "Annual pre-tax deductions",
        required: false,
        valueType: { format: "money", type: "number" },
      },
    ],
    outputs: takeHomePayOutputPorts,
  },
  title: "US Paycheck Calculator",
});

export default usTakeHomePayTool;
