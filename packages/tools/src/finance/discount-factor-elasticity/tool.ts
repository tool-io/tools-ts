import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rate: number; readonly periods: number };
export type Output = { readonly elasticity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rate: { type: "number", exclusiveMinimum: -1 },
    periods: { type: "number" },
  },
  required: ["rate", "periods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elasticity: { type: "number" } },
  required: ["elasticity"],
} as const;
/** Rate elasticity r*D′/D for D=(1+r)^(-periods), retaining valid negative rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rate, periods } = request;
  const compute = (): Output => {
    H.domain(rate > -1);
    return { elasticity: (-periods * rate) / (1 + rate) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rate: 0.1, periods: 2 },
  output: { elasticity: -0.18181818181818182 },
} satisfies ToolExample<Input, Output>;
export const discountFactorElasticityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/discount-factor-elasticity",
    title: "Discount Factor Elasticity Tool",
    description:
      "Rate elasticity r*D′/D for D=(1+r)^(-periods), retaining valid negative rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rate: { type: "number", exclusiveMinimum: -1 },
        periods: { type: "number" },
      },
      required: ["rate", "periods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elasticity: { type: "number" } },
      required: ["elasticity"],
    },
    ports: {
      inputs: [
        {
          id: "rate",
          label: "Rate",
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
          id: "elasticity",
          label: "Elasticity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = discountFactorElasticityTool.execute;
export default discountFactorElasticityTool;
