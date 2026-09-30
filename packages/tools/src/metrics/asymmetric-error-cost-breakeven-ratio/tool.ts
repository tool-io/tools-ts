import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly underCost: number; readonly overCost: number };
export type Output = { readonly quantile: number; readonly odds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    underCost: { type: "number", exclusiveMinimum: 0 },
    overCost: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["underCost", "overCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quantile: { type: "number" }, odds: { type: "number" } },
  required: ["quantile", "odds"],
} as const;
/** Compute asymmetric error cost breakeven ratio from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { underCost, overCost } = input;
  const compute = (): Output => {
    positive(underCost);
    positive(overCost);
    return {
      quantile: underCost / (underCost + overCost),
      odds: underCost / overCost,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { underCost: 3, overCost: 1 },
  output: { quantile: 0.75, odds: 3 },
} satisfies ToolExample<Input, Output>;
export const asymmetricErrorCostBreakevenRatioTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/asymmetric-error-cost-breakeven-ratio",
  title: "Asymmetric Error Cost Breakeven Ratio Tool",
  description:
    "Compute asymmetric error cost breakeven ratio from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "underCost",
        label: "Under Cost",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "overCost",
        label: "Over Cost",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "quantile", label: "Quantile", valueType: { type: "number" } },
      { id: "odds", label: "Odds", valueType: { type: "number" } },
    ],
  },
});
export const run = asymmetricErrorCostBreakevenRatioTool.execute;
export default asymmetricErrorCostBreakevenRatioTool;
