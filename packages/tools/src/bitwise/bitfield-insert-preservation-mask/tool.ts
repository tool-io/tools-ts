import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly width: number;
  readonly offset: number;
  readonly length: number;
};
export type Output = {
  readonly preservationMask: string;
  readonly insertionMask: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "integer", minimum: 1, maximum: 128 },
    offset: { type: "integer", minimum: 0 },
    length: { type: "integer", minimum: 1 },
  },
  required: ["width", "offset", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservationMask: { type: "string", maxLength: 8192 },
    insertionMask: { type: "string", maxLength: 8192 },
  },
  required: ["preservationMask", "insertionMask"],
} as const;
/** Compute bitfield insert preservation mask from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { width, offset, length } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    integer(offset, 0, width - 1);
    integer(length, 1, width - offset);
    const all = (1n << BigInt(width)) - 1n,
      field = ((1n << BigInt(length)) - 1n) << BigInt(offset);
    return {
      preservationMask: (all ^ field).toString(),
      insertionMask: field.toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { width: 8, offset: 2, length: 3 },
  output: { preservationMask: "227", insertionMask: "28" },
} satisfies ToolExample<Input, Output>;
export const bitfieldInsertPreservationMaskTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitfield-insert-preservation-mask",
  title: "Bitfield Insert Preservation Mask Tool",
  description:
    "Compute bitfield insert preservation mask from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "offset",
        label: "Offset",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "length",
        label: "Length",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "preservationMask",
        label: "Preservation Mask",
        valueType: { type: "string" },
      },
      {
        id: "insertionMask",
        label: "Insertion Mask",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = bitfieldInsertPreservationMaskTool.execute;
export default bitfieldInsertPreservationMaskTool;
