import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spending: number;
  readonly otherRevenue: number;
  readonly taxableBase: number;
};
export type Output = {
  readonly requiredRevenue: number;
  readonly rate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spending: { type: "number", minimum: 0 },
    otherRevenue: { type: "number", minimum: 0 },
    taxableBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spending", "otherRevenue", "taxableBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredRevenue: { type: "number" }, rate: { type: "number" } },
  required: ["requiredRevenue", "rate"],
} as const;
/** Static balancing rate; negative rates expose a surplus rather than silently imposing a zero floor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spending, otherRevenue, taxableBase } = request;
  const compute = (): Output => {
    H.domain(spending >= 0 && otherRevenue >= 0);
    H.positive(taxableBase);
    return {
      requiredRevenue: spending - otherRevenue,
      rate: (spending - otherRevenue) / taxableBase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spending: 1000, otherRevenue: 200, taxableBase: 4000 },
  output: { requiredRevenue: 800, rate: 0.2 },
} satisfies ToolExample<Input, Output>;
export const budgetNeutralRateOneBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/budget-neutral-rate-one-base",
    title: "Budget Neutral Rate One Base Tool",
    description:
      "Static balancing rate; negative rates expose a surplus rather than silently imposing a zero floor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spending: { type: "number", minimum: 0 },
        otherRevenue: { type: "number", minimum: 0 },
        taxableBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spending", "otherRevenue", "taxableBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredRevenue: { type: "number" },
        rate: { type: "number" },
      },
      required: ["requiredRevenue", "rate"],
    },
    ports: {
      inputs: [
        {
          id: "spending",
          label: "Spending",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherRevenue",
          label: "Other Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxableBase",
          label: "Taxable Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredRevenue",
          label: "Required Revenue",
          valueType: { type: "number" },
        },
        { id: "rate", label: "Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = budgetNeutralRateOneBaseTool.execute;
export default budgetNeutralRateOneBaseTool;
