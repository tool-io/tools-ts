import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly cost: number;
  readonly removedWeight: number;
  readonly replacementWeights: readonly number[];
};
export type Output = { readonly cost: number; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cost: { type: "number" },
    removedWeight: { type: "number" },
    replacementWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["cost", "removedWeight", "replacementWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cost: { type: "number" }, delta: { type: "number" } },
  required: ["cost", "delta"],
} as const;
/** Compute path cost single edge replacement term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { cost, removedWeight, replacementWeights } = input;
  const compute = (): Output => {
    const replacement = replacementWeights.reduce((a, b) => a + b, 0),
      delta = replacement - removedWeight;
    return { cost: cost + delta, delta };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cost: 10, removedWeight: 4, replacementWeights: [2, 3] },
  output: { cost: 11, delta: 1 },
} satisfies ToolExample<Input, Output>;
export const pathCostSingleEdgeReplacementTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "graph/path-cost-single-edge-replacement-term",
  title: "Path Cost Single Edge Replacement Term Tool",
  description:
    "Compute path cost single edge replacement term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "cost",
        label: "Cost",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "removedWeight",
        label: "Removed Weight",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "replacementWeights",
        label: "Replacement Weights",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
    outputs: [
      { id: "cost", label: "Cost", valueType: { type: "number" } },
      { id: "delta", label: "Delta", valueType: { type: "number" } },
    ],
  },
});
export const run = pathCostSingleEdgeReplacementTermTool.execute;
export default pathCostSingleEdgeReplacementTermTool;
