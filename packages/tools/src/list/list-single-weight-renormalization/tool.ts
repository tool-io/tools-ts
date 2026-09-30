import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly weights: readonly number[];
  readonly index: number;
  readonly replacement: number;
};
export type Output = { readonly normalized: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    index: { type: "integer", minimum: 0 },
    replacement: { type: "number" },
  },
  required: ["weights", "index", "replacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["normalized"],
} as const;
/** Compute list single weight renormalization from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { weights, index, replacement } = input;
  const compute = (): Output => {
    integer(index, 0, weights.length - 1);
    domain(weights.every((x) => x >= 0) && replacement >= 0);
    const w = weights.map((x, i) => (i === index ? replacement : x)),
      sum = w.reduce((a, b) => a + b, 0);
    positive(sum);
    return { normalized: w.map((x) => x / sum) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { weights: [1, 1], index: 0, replacement: 3 },
  output: { normalized: [0.75, 0.25] },
} satisfies ToolExample<Input, Output>;
export const listSingleWeightRenormalizationTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "list/list-single-weight-renormalization",
  title: "List Single Weight Renormalization Tool",
  description:
    "Compute list single weight renormalization from explicit bounded inputs.",
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
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "replacement",
        label: "Replacement",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "normalized",
        label: "Normalized",
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
  },
});
export const run = listSingleWeightRenormalizationTool.execute;
export default listSingleWeightRenormalizationTool;
