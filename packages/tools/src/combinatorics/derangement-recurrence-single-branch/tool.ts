import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly n: number; readonly previous: number };
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: { type: "integer", minimum: 2, maximum: 1000000 },
    previous: { type: "integer", minimum: 0 },
  },
  required: ["n", "previous"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "integer" } },
  required: ["contribution"],
} as const;
/** Calculate derangement recurrence single branch from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { n, previous } = input;
  const compute = (): Output => {
    H.integer(n, 2, 1000000);
    H.integer(previous, 0);
    return { contribution: (n - 1) * previous };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { n: 5, previous: 9 },
  output: { contribution: 36 },
} satisfies ToolExample<Input, Output>;
export const derangementRecurrenceSingleBranchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/derangement-recurrence-single-branch",
    title: "Derangement Recurrence Single Branch Tool",
    description:
      "Calculate derangement recurrence single branch from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        n: { type: "integer", minimum: 2, maximum: 1000000 },
        previous: { type: "integer", minimum: 0 },
      },
      required: ["n", "previous"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "integer" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        { id: "n", label: "N", required: true, valueType: { type: "integer" } },
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = derangementRecurrenceSingleBranchTool.execute;
export default derangementRecurrenceSingleBranchTool;
