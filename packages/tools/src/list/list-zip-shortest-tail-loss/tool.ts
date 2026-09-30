import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lengths: readonly number[] };
export type Output = {
  readonly outputLength: number;
  readonly discarded: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["lengths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputLength: { type: "integer" },
    discarded: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["outputLength", "discarded"],
} as const;
/** Calculate list zip shortest tail loss from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { lengths } = input;
  const compute = (): Output => {
    H.domain(lengths.length > 0 && lengths.every((x) => x >= 0));
    const outputLength = Math.min(...lengths);
    return { outputLength, discarded: lengths.map((x) => x - outputLength) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lengths: [3, 5, 4] },
  output: { outputLength: 3, discarded: [0, 2, 1] },
} satisfies ToolExample<Input, Output>;
export const listZipShortestTailLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-zip-shortest-tail-loss",
    title: "List Zip Shortest Tail Loss Tool",
    description:
      "Calculate list zip shortest tail loss from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["lengths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outputLength: { type: "integer" },
        discarded: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["outputLength", "discarded"],
    },
    ports: {
      inputs: [
        {
          id: "lengths",
          label: "Lengths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "outputLength",
          label: "Output Length",
          valueType: { type: "integer" },
        },
        {
          id: "discarded",
          label: "Discarded",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = listZipShortestTailLossTool.execute;
export default listZipShortestTailLossTool;
