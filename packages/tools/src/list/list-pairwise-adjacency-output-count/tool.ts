import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly cyclic: boolean };
export type Output = { readonly pairs: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    cyclic: { type: "boolean" },
  },
  required: ["length", "cyclic"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pairs: { type: "integer" } },
  required: ["pairs"],
} as const;
/** Calculate list pairwise adjacency output count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, cyclic } = input;
  const compute = (): Output => {
    H.integer(length, 0);
    return { pairs: length === 0 ? 0 : cyclic ? length : length - 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 5, cyclic: false },
  output: { pairs: 4 },
} satisfies ToolExample<Input, Output>;
export const listPairwiseAdjacencyOutputCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-pairwise-adjacency-output-count",
    title: "List Pairwise Adjacency Output Count Tool",
    description:
      "Calculate list pairwise adjacency output count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 0 },
        cyclic: { type: "boolean" },
      },
      required: ["length", "cyclic"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pairs: { type: "integer" } },
      required: ["pairs"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cyclic",
          label: "Cyclic",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "pairs", label: "Pairs", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listPairwiseAdjacencyOutputCountTool.execute;
export default listPairwiseAdjacencyOutputCountTool;
