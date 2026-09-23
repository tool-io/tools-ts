import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
};
export type Output = { readonly sum: number; readonly carry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer" },
    second: { type: "integer" },
    third: { type: "integer" },
  },
  required: ["first", "second", "third"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sum: { type: "integer" }, carry: { type: "integer" } },
  required: ["sum", "carry"],
} as const;
/** Calculate carry save adder one column from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, third } = input;
  const compute = (): Output => {
    for (const x of [first, second, third]) H.integer(x, 0, 1);
    const total = first + second + third;
    return { sum: total % 2, carry: Math.floor(total / 2) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 1, second: 1, third: 1 },
  output: { sum: 1, carry: 1 },
} satisfies ToolExample<Input, Output>;
export const carrySaveAdderOneColumnTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/carry-save-adder-one-column",
    title: "Carry Save Adder One Column Tool",
    description:
      "Calculate carry save adder one column from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer" },
        second: { type: "integer" },
        third: { type: "integer" },
      },
      required: ["first", "second", "third"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sum: { type: "integer" }, carry: { type: "integer" } },
      required: ["sum", "carry"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "third",
          label: "Third",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "sum", label: "Sum", valueType: { type: "integer" } },
        { id: "carry", label: "Carry", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = carrySaveAdderOneColumnTool.execute;
export default carrySaveAdderOneColumnTool;
