import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effectiveRate: number;
  readonly periods: number;
};
export type Output = { readonly discountFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveRate: { type: "number", exclusiveMinimum: -1 },
    periods: { type: "number", minimum: 0 },
  },
  required: ["effectiveRate", "periods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { discountFactor: { type: "number" } },
  required: ["discountFactor"],
} as const;
/** Evaluate a caller-supplied effective-rate discount factor without choosing a social discount rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effectiveRate, periods } = request;
  const compute = (): Output => {
    H.domain(effectiveRate > -1 && periods >= 0);
    return { discountFactor: Math.exp(-periods * Math.log1p(effectiveRate)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effectiveRate: 0, periods: 5 },
  output: { discountFactor: 1 },
} satisfies ToolExample<Input, Output>;
export const environmentalDiscountPeriodFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/environmental-discount-period-factor",
    title: "Environmental Discount Period Factor Tool",
    description:
      "Evaluate a caller-supplied effective-rate discount factor without choosing a social discount rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveRate: { type: "number", exclusiveMinimum: -1 },
        periods: { type: "number", minimum: 0 },
      },
      required: ["effectiveRate", "periods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { discountFactor: { type: "number" } },
      required: ["discountFactor"],
    },
    ports: {
      inputs: [
        {
          id: "effectiveRate",
          label: "Effective Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periods",
          label: "Periods",
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
      ],
    },
  },
  calculate,
});
export const run = environmentalDiscountPeriodFactorTool.execute;
export default environmentalDiscountPeriodFactorTool;
