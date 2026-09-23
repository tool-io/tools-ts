import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mask: number;
  readonly first: number;
  readonly second: number;
  readonly width: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mask: { type: "integer" },
    first: { type: "integer" },
    second: { type: "integer" },
    width: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["mask", "first", "second", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Calculate ternary bitselect one word from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mask, first, second, width } = input;
  const compute = (): Output => {
    H.integer(width, 1, 32);
    const max = 2 ** width - 1;
    for (const x of [mask, first, second]) H.integer(x, 0, max);
    return {
      value: Number(
        (BigInt(mask) & BigInt(first)) |
          ((BigInt(max) ^ BigInt(mask)) & BigInt(second)),
      ),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mask: 15, first: 170, second: 85, width: 8 },
  output: { value: 90 },
} satisfies ToolExample<Input, Output>;
export const ternaryBitselectOneWordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/ternary-bitselect-one-word",
    title: "Ternary Bitselect One Word Tool",
    description:
      "Calculate ternary bitselect one word from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mask: { type: "integer" },
        first: { type: "integer" },
        second: { type: "integer" },
        width: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["mask", "first", "second", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "integer" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "mask",
          label: "Mask",
          required: true,
          valueType: { type: "integer" },
        },
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
      ],
    },
  },
  calculate,
});
export const run = ternaryBitselectOneWordTool.execute;
export default ternaryBitselectOneWordTool;
