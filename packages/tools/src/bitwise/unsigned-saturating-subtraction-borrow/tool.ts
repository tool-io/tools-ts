import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly width: number;
};
export type Output = { readonly value: number; readonly borrow: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 0 },
    second: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["first", "second", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" }, borrow: { type: "boolean" } },
  required: ["value", "borrow"],
} as const;
/** Calculate unsigned saturating subtraction borrow from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, width } = input;
  const compute = (): Output => {
    H.integer(width, 1, 32);
    const max = 2 ** width - 1;
    H.integer(first, 0, max);
    H.integer(second, 0, max);
    return { value: Math.max(0, first - second), borrow: first < second };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 3, second: 5, width: 8 },
  output: { value: 0, borrow: true },
} satisfies ToolExample<Input, Output>;
export const unsignedSaturatingSubtractionBorrowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bitwise/unsigned-saturating-subtraction-borrow",
      title: "Unsigned Saturating Subtraction Borrow Tool",
      description:
        "Calculate unsigned saturating subtraction borrow from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "integer", minimum: 0 },
          second: { type: "integer", minimum: 0 },
          width: { type: "integer", minimum: 1, maximum: 32 },
        },
        required: ["first", "second", "width"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "integer" }, borrow: { type: "boolean" } },
        required: ["value", "borrow"],
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
            id: "width",
            label: "Width",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "value", label: "Value", valueType: { type: "integer" } },
          { id: "borrow", label: "Borrow", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = unsignedSaturatingSubtractionBorrowTool.execute;
export default unsignedSaturatingSubtractionBorrowTool;
