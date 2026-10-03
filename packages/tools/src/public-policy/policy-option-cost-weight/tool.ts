import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cost: number; readonly weight: number };
export type Output = { readonly weightedCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cost: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["cost", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedCost: { type: "number" } },
  required: ["weightedCost"],
} as const;
/** Return one supplied option cost contribution under an explicit nonnegative weight. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cost, weight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return { weightedCost: cost * weight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cost: 120, weight: 0.25 },
  output: { weightedCost: 30 },
} satisfies ToolExample<Input, Output>;
export const policyOptionCostWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-option-cost-weight",
    title: "Policy Option Cost Weight Tool",
    description:
      "Return one supplied option cost contribution under an explicit nonnegative weight.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cost: { type: "number" },
        weight: { type: "number", minimum: 0 },
      },
      required: ["cost", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedCost: { type: "number" } },
      required: ["weightedCost"],
    },
    ports: {
      inputs: [
        {
          id: "cost",
          label: "Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedCost",
          label: "Weighted Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyOptionCostWeightTool.execute;
export default policyOptionCostWeightTool;
