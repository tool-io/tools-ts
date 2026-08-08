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
  swissCantonNames,
  swissCantonTaxFactors2026,
  swissReferenceTaxBrackets2026,
  type SwissCantonCode,
} from "./rules-2026.js";

export type SwitzerlandTakeHomePayInput = {
  readonly children?: number;
  readonly churchTax?: boolean;
  readonly grossPay: number;
  readonly location?: SwissCantonCode;
  readonly maritalStatus?: "single" | "married";
  readonly payPeriod?: PayPeriod;
};

export const switzerlandTakeHomePayExample = {
  input: { grossPay: 50_000, location: "ZH", payPeriod: "yearly" },
} satisfies ToolExample<SwitzerlandTakeHomePayInput, TakeHomePayOutput>;

export const calculateSwitzerlandTakeHomePay = (
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
  const maritalStatus = input.maritalStatus ?? "single";
  const children = input.children ?? 0;
  const churchTax = input.churchTax ?? false;
  const location = input.location ?? "ZH";
  const issues: ToolIssue[] = [
    ...unknownFieldIssues(input, [
      "children",
      "churchTax",
      "grossPay",
      "location",
      "maritalStatus",
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
  if (maritalStatus !== "single" && maritalStatus !== "married")
    issues.push({
      code: "invalid_marital_status",
      field: "maritalStatus",
      message: "Marital status must be single or married.",
    });
  if (
    typeof children !== "number" ||
    !Number.isSafeInteger(children) ||
    children < 0
  )
    issues.push({
      code: "invalid_children",
      field: "children",
      message: "Children must be a nonnegative integer.",
    });
  if (typeof churchTax !== "boolean")
    issues.push({
      code: "invalid_church_tax",
      field: "churchTax",
      message: "Church tax must be true or false.",
    });
  if (typeof location !== "string" || !(location in swissCantonTaxFactors2026))
    issues.push({
      code: "invalid_canton",
      field: "location",
      message: "Location must be a supported Swiss canton code.",
    });
  if (issues.length > 0 || !normalized) return invalidInput(issues);

  const annual = normalized.annual;
  const childCount = children as number;
  const canton = location as SwissCantonCode;
  const ahvIvEo = annual * 0.053;
  const unemployment = Math.min(annual, 148_200) * 0.011;
  const accidentInsurance = annual * 0.01;
  const occupationalPension = annual * 0.05;
  const taxableIncome = Math.max(
    0,
    annual -
      ahvIvEo -
      unemployment -
      occupationalPension -
      15_000 -
      childCount * 6_500,
  );
  const referenceTaxResult = calculateProgressiveTax({
    brackets: swissReferenceTaxBrackets2026,
    income: taxableIncome,
  });
  if (!referenceTaxResult.ok) return referenceTaxResult;
  const incomeTax =
    referenceTaxResult.output.tax *
    swissCantonTaxFactors2026[canton] *
    (maritalStatus === "married" ? 0.78 : 1);
  const church = churchTax ? incomeTax * 0.05 : 0;
  const locationName = swissCantonNames[canton];

  return toolSuccess(
    createTakeHomePayOutput({
      annual,
      assumptions: [
        locationName,
        maritalStatus === "married" ? "Married" : "Single",
        `${childCount} children`,
        churchTax ? "Church tax included" : "No church tax",
        "Employee",
        "Reference pension and accident-insurance rates",
      ],
      country: "Switzerland",
      currency: "CHF",
      deductions: [
        {
          amount: incomeTax,
          code: "income_tax",
          label: "Estimated federal, cantonal and municipal tax",
        },
        { amount: church, code: "church_tax", label: "Church tax estimate" },
        {
          amount: ahvIvEo,
          code: "oasi_di_eo",
          label: "OASI / DI / EO contributions",
        },
        {
          amount: unemployment,
          code: "unemployment_insurance",
          label: "Unemployment insurance",
        },
        {
          amount: accidentInsurance,
          code: "accident_insurance",
          label: "Non-occupational accident insurance estimate",
        },
        {
          amount: occupationalPension,
          code: "occupational_pension",
          label: "Occupational pension estimate",
        },
      ],
      locale: "de-CH",
      location: locationName,
      period: normalized.period,
      ruleVersion: "ch-2026-reference.1",
      taxYear: "2026 reference estimate",
      warnings: [
        "Cantonal and municipal tax is a reference estimate rather than an official assessment.",
      ],
    }),
  );
};

export const switzerlandTakeHomePayTool = defineTool<
  SwitzerlandTakeHomePayInput,
  TakeHomePayOutput
>({
  contractVersion: 1,
  description:
    "Estimate Swiss take-home pay using a selected canton and reference municipality.",
  execute: calculateSwitzerlandTakeHomePay,
  execution: { kind: "pure" },
  id: "take-home-pay-calculator/ch",
  inputSchema: {
    additionalProperties: false,
    properties: {
      ...takeHomePayBaseInputProperties,
      children: { default: 0, minimum: 0, type: "integer" },
      churchTax: { default: false, type: "boolean" },
      location: {
        default: "ZH",
        enum: Object.keys(swissCantonTaxFactors2026),
        type: "string",
      },
      maritalStatus: {
        default: "single",
        enum: ["single", "married"],
        type: "string",
      },
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
        label: "Canton",
        required: false,
        valueType: { format: "ch-canton", type: "string" },
      },
      {
        id: "maritalStatus",
        label: "Marital status",
        required: false,
        valueType: { format: "marital-status", type: "string" },
      },
      {
        id: "children",
        label: "Children",
        required: false,
        valueType: { format: "count", type: "integer" },
      },
      {
        id: "churchTax",
        label: "Church tax",
        required: false,
        valueType: { type: "boolean" },
      },
    ],
    outputs: takeHomePayOutputPorts,
  },
  title: "Switzerland Take-Home Pay Calculator",
});

export default switzerlandTakeHomePayTool;
