import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zeroOffset: number;
  readonly reference: number;
  readonly bits: number;
};
export type Output = { readonly offsetLsb: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroOffset: { type: "number" },
    reference: { type: "number", exclusiveMinimum: 0 },
    bits: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["zeroOffset", "reference", "bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offsetLsb: { type: "number" } },
  required: ["offsetLsb"],
} as const;
/** Calculate dac unipolar zero scale gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { zeroOffset, reference, bits } = input;
  const compute = (): Output => {
    H.positive(reference);
    H.integer(bits, 1, 32);
    return { offsetLsb: zeroOffset / (reference / 2 ** bits) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { zeroOffset: 0.01, reference: 2.56, bits: 8 },
  output: { offsetLsb: 1 },
} satisfies ToolExample<Input, Output>;
export const dacUnipolarZeroScaleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/dac-unipolar-zero-scale-gap",
    title: "Dac Unipolar Zero Scale Gap Tool",
    description:
      "Calculate dac unipolar zero scale gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroOffset: { type: "number" },
        reference: { type: "number", exclusiveMinimum: 0 },
        bits: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["zeroOffset", "reference", "bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offsetLsb: { type: "number" } },
      required: ["offsetLsb"],
    },
    ports: {
      inputs: [
        {
          id: "zeroOffset",
          label: "Zero Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bits",
          label: "Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "offsetLsb", label: "Offset Lsb", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dacUnipolarZeroScaleGapTool.execute;
export default dacUnipolarZeroScaleGapTool;
