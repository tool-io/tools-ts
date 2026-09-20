import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { generatorFailure } from "../../random/generator-random.js";

export type SalaryOffer = {
  readonly annualBasePay: number;
  readonly annualBonus: number;
  readonly weeklyHours: number;
  readonly paidWeeksPerYear: number;
};
export type SalaryComparisonInput = {
  readonly currency: string;
  readonly first: SalaryOffer;
  readonly second: SalaryOffer;
};
export type SalaryComparisonOutput = {
  readonly currency: string;
  readonly first: {
    readonly annualGrossPay: number;
    readonly annualPaidHours: number;
    readonly effectiveHourlyPay: number;
  };
  readonly second: {
    readonly annualGrossPay: number;
    readonly annualPaidHours: number;
    readonly effectiveHourlyPay: number;
  };
  readonly annualGrossDifference: number;
  readonly hourlyPayDifference: number;
};
const offerSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualBasePay: { type: "number", minimum: 0 },
    annualBonus: { type: "number" },
    weeklyHours: { type: "number", exclusiveMinimum: 0 },
    paidWeeksPerYear: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["annualBasePay", "annualBonus", "weeklyHours", "paidWeeksPerYear"],
} as const;
const resultSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualGrossPay: { type: "number" },
    annualPaidHours: { type: "number", exclusiveMinimum: 0 },
    effectiveHourlyPay: { type: "number" },
  },
  required: ["annualGrossPay", "annualPaidHours", "effectiveHourlyPay"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currency: { type: "string", minLength: 1, maxLength: 16 },
    first: offerSchema,
    second: offerSchema,
  },
  required: ["currency", "first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currency: { type: "string", minLength: 1, maxLength: 16 },
    first: resultSchema,
    second: resultSchema,
    annualGrossDifference: { type: "number" },
    hourlyPayDifference: { type: "number" },
  },
  required: [
    "currency",
    "first",
    "second",
    "annualGrossDifference",
    "hourlyPayDifference",
  ],
} as const;

const isInput = (input: unknown): input is SalaryComparisonInput =>
  matchesModelInput(input, inputSchema);
export const calculateSalaryComparison = (
  input: unknown,
): ToolResult<SalaryComparisonOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const summarize = (offer: SalaryOffer, field: "first" | "second") => {
      const annualGrossPay = offer.annualBasePay + offer.annualBonus;
      const annualPaidHours = offer.weeklyHours * offer.paidWeeksPerYear;
      if (
        !Number.isFinite(annualGrossPay) ||
        !Number.isFinite(annualPaidHours) ||
        annualPaidHours <= 0
      )
        simpleError(
          field,
          "Annual pay and positive paid hours must remain finite.",
          "numeric_overflow",
        );
      const effectiveHourlyPay = annualGrossPay / annualPaidHours;
      if (!Number.isFinite(effectiveHourlyPay))
        simpleError(
          field,
          "Effective hourly pay must remain finite.",
          "numeric_overflow",
        );
      return { annualGrossPay, annualPaidHours, effectiveHourlyPay };
    };
    const first = summarize(input.first, "first"),
      second = summarize(input.second, "second");
    const annualGrossDifference = second.annualGrossPay - first.annualGrossPay,
      hourlyPayDifference =
        second.effectiveHourlyPay - first.effectiveHourlyPay;
    if (![annualGrossDifference, hourlyPayDifference].every(Number.isFinite))
      simpleError(
        "second",
        "Comparison differences must remain finite.",
        "numeric_overflow",
      );
    return toolSuccess({
      currency: input.currency,
      first,
      second,
      annualGrossDifference,
      hourlyPayDifference,
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const salaryComparisonExample = {
  input: {
    currency: "EUR",
    first: {
      annualBasePay: 60000,
      annualBonus: 2400,
      weeklyHours: 40,
      paidWeeksPerYear: 52,
    },
    second: {
      annualBasePay: 65000,
      annualBonus: 0,
      weeklyHours: 35,
      paidWeeksPerYear: 52,
    },
  },
  output: {
    currency: "EUR",
    first: {
      annualGrossPay: 62400,
      annualPaidHours: 2080,
      effectiveHourlyPay: 30,
    },
    second: {
      annualGrossPay: 65000,
      annualPaidHours: 1820,
      effectiveHourlyPay: 35.714285714285715,
    },
    annualGrossDifference: 2600,
    hourlyPayDifference: 5.714285714285715,
  },
} satisfies ToolExample<SalaryComparisonInput, SalaryComparisonOutput>;
export const salaryComparisonTool = createModelDefinition<
  SalaryComparisonInput,
  SalaryComparisonOutput
>({
  id: "finance/salary-comparison",
  title: "Gross Salary and Effective Hourly Pay Comparison Tool",
  description:
    "Compare two supplied same-currency annual base salaries and bonuses against explicit weekly hours and paid weeks; report nominal gross cash and effective hourly differences without taxes, benefits, exchange rates or recommendations.",
  inputSchema,
  outputSchema,
  execute: calculateSalaryComparison,
});
export const runSalaryComparison = salaryComparisonTool.execute;
export default salaryComparisonTool;
