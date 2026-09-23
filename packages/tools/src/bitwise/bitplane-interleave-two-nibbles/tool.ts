import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 0, maximum: 15 },
    second: { type: "integer", minimum: 0, maximum: 15 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Calculate bitplane interleave two nibbles from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second } = input;
  const compute = (): Output => {
    H.integer(first, 0, 15);
    H.integer(second, 0, 15);
    let value = 0;
    for (let i = 0; i < 4; i++)
      value |=
        (((first >> i) & 1) << (2 * i)) | (((second >> i) & 1) << (2 * i + 1));
    return { value };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 15, second: 0 },
  output: { value: 85 },
} satisfies ToolExample<Input, Output>;
export const bitplaneInterleaveTwoNibblesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitplane-interleave-two-nibbles",
    title: "Bitplane Interleave Two Nibbles Tool",
    description:
      "Calculate bitplane interleave two nibbles from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 0, maximum: 15 },
        second: { type: "integer", minimum: 0, maximum: 15 },
      },
      required: ["first", "second"],
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
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bitplaneInterleaveTwoNibblesTool.execute;
export default bitplaneInterleaveTwoNibblesTool;
