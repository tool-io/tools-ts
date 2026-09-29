import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly weights: readonly number[];
  readonly nodes: readonly number[];
  readonly x: number;
  readonly index: number;
};
export type Output = { readonly influence: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
    x: { type: "number" },
    index: { type: "integer", minimum: 0 },
  },
  required: ["weights", "nodes", "x", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { influence: { type: "number" } },
  required: ["influence"],
} as const;
/** Compute barycentric single node influence ratio from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { weights, nodes, x, index } = input;
  const compute = (): Output => {
    sameLength(weights, nodes);
    domain(nodes.length > 0 && new Set(nodes).size === nodes.length);
    integer(index, 0, nodes.length - 1);
    const hit = nodes.indexOf(x);
    if (hit >= 0) return { influence: hit === index ? 1 : 0 };
    const terms = weights.map((w, i) => w / (x - nodes[i])),
      sum = terms.reduce((a, b) => a + b, 0);
    domain(sum !== 0);
    return { influence: terms[index] / sum };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { weights: [1, -1], nodes: [0, 2], x: 1, index: 0 },
  output: { influence: 0.5 },
} satisfies ToolExample<Input, Output>;
export const barycentricSingleNodeInfluenceRatioTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "interpolation/barycentric-single-node-influence-ratio",
  title: "Barycentric Single Node Influence Ratio Tool",
  description:
    "Compute barycentric single node influence ratio from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "weights",
        label: "Weights",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "nodes",
        label: "Nodes",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      { id: "x", label: "X", required: true, valueType: { type: "number" } },
      {
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "influence", label: "Influence", valueType: { type: "number" } },
    ],
  },
});
export const run = barycentricSingleNodeInfluenceRatioTool.execute;
export default barycentricSingleNodeInfluenceRatioTool;
