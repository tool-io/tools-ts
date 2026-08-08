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
import { germanIncomeTax2026, germanPayrollRules2026 } from "./rules-2026.js";

export type GermanyTakeHomePayInput = {
  readonly children?: number;
  readonly churchTax?: boolean;
  readonly grossPay: number;
  readonly location?: "de";
  readonly payPeriod?: PayPeriod;
  readonly taxClass?: "1" | "3";
};

export const germanyTakeHomePayExample = {
  input: { grossPay: 50_000, payPeriod: "yearly" },
} satisfies ToolExample<GermanyTakeHomePayInput, TakeHomePayOutput>;

export const calculateGermanyTakeHomePay = (
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
  const taxClass = input.taxClass ?? "1";
  const children = input.children ?? 0;
  const churchTax = input.churchTax ?? false;
  const location = input.location ?? "de";
  const issues: ToolIssue[] = [
    ...unknownFieldIssues(input, [
      "children",
      "churchTax",
      "grossPay",
      "location",
      "payPeriod",
      "taxClass",
    ]),
  ];
  if (!normalized)
    issues.push({
      code: "invalid_pay",
      field: "grossPay",
      message:
        "Gross pay and pay period must produce finite nonnegative annual pay.",
    });
  if (taxClass !== "1" && taxClass !== "3")
    issues.push({
      code: "invalid_tax_class",
      field: "taxClass",
      message: "Tax class must be 1 or 3.",
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
  if (location !== "de")
    issues.push({
      code: "invalid_location",
      field: "location",
      message: "The supported location is Germany.",
    });
  if (issues.length > 0 || !normalized) return invalidInput(issues);

  const childCount = children as number;
  const rules = germanPayrollRules2026;
  const pensionBase = Math.min(
    normalized.annual,
    rules.pensionAssessmentCeiling,
  );
  const healthBase = Math.min(normalized.annual, rules.healthAssessmentCeiling);
  const pension = pensionBase * rules.pensionEmployeeRate;
  const unemployment = pensionBase * rules.unemploymentEmployeeRate;
  const health = healthBase * rules.healthEmployeeRate;
  const care =
    healthBase *
    (childCount > 0
      ? rules.careEmployeeRateWithChildren
      : rules.careEmployeeRateWithoutChildren);
  const socialInsurance = pension + unemployment + health + care;
  const taxableIncome = Math.max(
    0,
    normalized.annual -
      socialInsurance -
      rules.employeeExpenseAllowance -
      rules.specialExpenseAllowance,
  );
  const incomeTax =
    taxClass === "3"
      ? germanIncomeTax2026(taxableIncome / 2) * 2
      : germanIncomeTax2026(taxableIncome);
  const solidaritySurcharge = Math.min(
    incomeTax * rules.solidarityRate,
    Math.max(
      0,
      (incomeTax - rules.solidarityExemption) * rules.solidarityPhaseInRate,
    ),
  );
  const church = churchTax ? incomeTax * 0.09 : 0;

  return toolSuccess(
    createTakeHomePayOutput({
      annual: normalized.annual,
      assumptions: [
        "Employee",
        `Tax class ${taxClass}`,
        childCount > 0 ? "Children selected" : "No children",
        churchTax ? "Church tax included" : "No church tax",
        "Statutory insurance",
        "Average health-insurance supplement",
      ],
      country: "Germany",
      currency: "EUR",
      deductions: [
        { amount: incomeTax, code: "income_tax", label: "Income tax estimate" },
        {
          amount: solidaritySurcharge,
          code: "solidarity_surcharge",
          label: "Solidarity surcharge",
        },
        { amount: church, code: "church_tax", label: "Church tax" },
        {
          amount: pension,
          code: "pension_insurance",
          label: "Pension insurance",
        },
        {
          amount: unemployment,
          code: "unemployment_insurance",
          label: "Unemployment insurance",
        },
        { amount: health, code: "health_insurance", label: "Health insurance" },
        {
          amount: care,
          code: "long_term_care_insurance",
          label: "Long-term care insurance",
        },
      ],
      locale: "de-DE",
      location: "Germany",
      period: normalized.period,
      ruleVersion: "de-2026.1",
      taxYear: "2026",
    }),
  );
};

export const germanyTakeHomePayTool = defineTool<
  GermanyTakeHomePayInput,
  TakeHomePayOutput
>({
  contractVersion: 1,
  description:
    "Estimate German take-home pay after wage tax and employee social-insurance contributions.",
  execute: calculateGermanyTakeHomePay,
  execution: { kind: "pure" },
  id: "take-home-pay-calculator/de",
  inputSchema: {
    additionalProperties: false,
    properties: {
      ...takeHomePayBaseInputProperties,
      children: { default: 0, minimum: 0, type: "integer" },
      churchTax: { default: false, type: "boolean" },
      location: { default: "de", enum: ["de"], type: "string" },
      taxClass: { default: "1", enum: ["1", "3"], type: "string" },
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
        valueType: { format: "country-code", type: "string" },
      },
      {
        id: "taxClass",
        label: "Tax class",
        required: false,
        valueType: { format: "de-tax-class", type: "string" },
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
  title: "Germany Take-Home Pay Calculator",
});

export default germanyTakeHomePayTool;
