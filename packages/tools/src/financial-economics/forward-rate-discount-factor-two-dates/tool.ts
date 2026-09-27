import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDiscount: number;
  readonly secondDiscount: number;
  readonly firstYears: number;
  readonly secondYears: number;
  readonly continuous: boolean;
};
export type Output = { readonly forwardRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDiscount: { type: "number", exclusiveMinimum: 0 },
    secondDiscount: { type: "number", exclusiveMinimum: 0 },
    firstYears: { type: "number", minimum: 0 },
    secondYears: { type: "number" },
    continuous: { type: "boolean" },
  },
  required: [
    "firstDiscount",
    "secondDiscount",
    "firstYears",
    "secondYears",
    "continuous",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { forwardRate: { type: "number" } },
  required: ["forwardRate"],
} as const;
/** Forward rate from discount factors under explicit continuous or effective annual compounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDiscount, secondDiscount, firstYears, secondYears, continuous } =
    request;
  const compute = (): Output => {
    H.positive(firstDiscount);
    H.positive(secondDiscount);
    H.domain(firstYears >= 0 && secondYears > firstYears);
    return {
      forwardRate: continuous
        ? Math.log(firstDiscount / secondDiscount) / (secondYears - firstYears)
        : (firstDiscount / secondDiscount) ** (1 / (secondYears - firstYears)) -
          1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDiscount: 0.95,
    secondDiscount: 0.9,
    firstYears: 1,
    secondYears: 2,
    continuous: false,
  },
  output: { forwardRate: 0.05555555555555558 },
} satisfies ToolExample<Input, Output>;
export const forwardRateDiscountFactorTwoDatesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/forward-rate-discount-factor-two-dates",
    title: "Forward Rate Discount Factor Two Dates Tool",
    description:
      "Forward rate from discount factors under explicit continuous or effective annual compounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDiscount: { type: "number", exclusiveMinimum: 0 },
        secondDiscount: { type: "number", exclusiveMinimum: 0 },
        firstYears: { type: "number", minimum: 0 },
        secondYears: { type: "number" },
        continuous: { type: "boolean" },
      },
      required: [
        "firstDiscount",
        "secondDiscount",
        "firstYears",
        "secondYears",
        "continuous",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { forwardRate: { type: "number" } },
      required: ["forwardRate"],
    },
    ports: {
      inputs: [
        {
          id: "firstDiscount",
          label: "First Discount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiscount",
          label: "Second Discount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstYears",
          label: "First Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondYears",
          label: "Second Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "continuous",
          label: "Continuous",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "forwardRate",
          label: "Forward Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = forwardRateDiscountFactorTwoDatesTool.execute;
export default forwardRateDiscountFactorTwoDatesTool;
