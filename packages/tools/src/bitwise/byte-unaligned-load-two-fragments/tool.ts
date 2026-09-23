import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly offset: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 0, maximum: 255 },
    second: { type: "integer", minimum: 0, maximum: 255 },
    offset: { type: "integer", minimum: 0, maximum: 7 },
  },
  required: ["first", "second", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Calculate byte unaligned load two fragments from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, offset } = input;
  const compute = (): Output => {
    H.integer(first, 0, 255);
    H.integer(second, 0, 255);
    H.integer(offset, 0, 7);
    return { value: ((first + second * 256) >>> offset) & 255 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 240, second: 15, offset: 4 },
  output: { value: 255 },
} satisfies ToolExample<Input, Output>;
export const byteUnalignedLoadTwoFragmentsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/byte-unaligned-load-two-fragments",
    title: "Byte Unaligned Load Two Fragments Tool",
    description:
      "Calculate byte unaligned load two fragments from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 0, maximum: 255 },
        second: { type: "integer", minimum: 0, maximum: 255 },
        offset: { type: "integer", minimum: 0, maximum: 7 },
      },
      required: ["first", "second", "offset"],
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
          id: "offset",
          label: "Offset",
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
export const run = byteUnalignedLoadTwoFragmentsTool.execute;
export default byteUnalignedLoadTwoFragmentsTool;
