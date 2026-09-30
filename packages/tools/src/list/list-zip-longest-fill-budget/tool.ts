import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lengths: readonly number[] };
export type Output = {
  readonly outputLength: number;
  readonly fills: readonly number[];
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
    fills: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["outputLength", "fills"],
} as const;
/** Calculate list zip longest fill budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { lengths } = input;
  const compute = (): Output => {
    H.domain(lengths.length > 0 && lengths.every((x) => x >= 0));
    const outputLength = Math.max(...lengths);
    return { outputLength, fills: lengths.map((x) => outputLength - x) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lengths: [3, 5, 4] },
  output: { outputLength: 5, fills: [2, 0, 1] },
} satisfies ToolExample<Input, Output>;
export const listZipLongestFillBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-zip-longest-fill-budget",
    title: "List Zip Longest Fill Budget Tool",
    description:
      "Calculate list zip longest fill budget from explicit caller-supplied inputs.",
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
        fills: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["outputLength", "fills"],
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
          id: "fills",
          label: "Fills",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = listZipLongestFillBudgetTool.execute;
export default listZipLongestFillBudgetTool;
