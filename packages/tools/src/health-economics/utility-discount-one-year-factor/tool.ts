import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly utility: number;
  readonly durationYears: number;
  readonly timeYears: number;
  readonly annualDiscountRate: number;
};
export type Output = {
  readonly discountFactor: number;
  readonly discountedQalys: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utility: { type: "number" },
    durationYears: { type: "number", minimum: 0 },
    timeYears: { type: "number", minimum: 0 },
    annualDiscountRate: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["utility", "durationYears", "timeYears", "annualDiscountRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountFactor: { type: "number" },
    discountedQalys: { type: "number" },
  },
  required: ["discountFactor", "discountedQalys"],
} as const;
/** Calculate utility discount one year factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { utility, durationYears, timeYears, annualDiscountRate } = request;
  const compute = (): Output => {
    H.domain(durationYears >= 0 && timeYears >= 0 && annualDiscountRate > -1);
    return {
      discountFactor: (1 + annualDiscountRate) ** -timeYears,
      discountedQalys:
        utility * durationYears * (1 + annualDiscountRate) ** -timeYears,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    utility: 0.8,
    durationYears: 1,
    timeYears: 1,
    annualDiscountRate: 0.25,
  },
  output: { discountFactor: 0.8, discountedQalys: 0.6400000000000001 },
} satisfies ToolExample<Input, Output>;
export const utilityDiscountOneYearFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/utility-discount-one-year-factor",
    title: "Utility Discount One Year Factor Tool",
    description:
      "Calculate utility discount one year factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utility: { type: "number" },
        durationYears: { type: "number", minimum: 0 },
        timeYears: { type: "number", minimum: 0 },
        annualDiscountRate: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["utility", "durationYears", "timeYears", "annualDiscountRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountFactor: { type: "number" },
        discountedQalys: { type: "number" },
      },
      required: ["discountFactor", "discountedQalys"],
    },
    ports: {
      inputs: [
        {
          id: "utility",
          label: "Utility",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationYears",
          label: "Duration Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeYears",
          label: "Time Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualDiscountRate",
          label: "Annual Discount Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "discountFactor",
          label: "Discount Factor",
          valueType: { type: "number" },
        },
        {
          id: "discountedQalys",
          label: "Discounted Qalys",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = utilityDiscountOneYearFactorTool.execute;
export default utilityDiscountOneYearFactorTool;
