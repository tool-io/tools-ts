import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly word: readonly string[] };
export type Output = { readonly equalNeighbors: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["word"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equalNeighbors: { type: "integer" } },
  required: ["equalNeighbors"],
} as const;
/** Calculate multiset word adjacent equality count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { word } = input;
  const compute = (): Output => {
    return {
      equalNeighbors: word.slice(1).filter((x, i) => x === word[i]).length,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: ["a", "a", "b", "b", "b"] },
  output: { equalNeighbors: 3 },
} satisfies ToolExample<Input, Output>;
export const multisetWordAdjacentEqualityCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/multiset-word-adjacent-equality-count",
    title: "Multiset Word Adjacent Equality Count Tool",
    description:
      "Calculate multiset word adjacent equality count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["word"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equalNeighbors: { type: "integer" } },
      required: ["equalNeighbors"],
    },
    ports: {
      inputs: [
        {
          id: "word",
          label: "Word",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "equalNeighbors",
          label: "Equal Neighbors",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = multisetWordAdjacentEqualityCountTool.execute;
export default multisetWordAdjacentEqualityCountTool;
