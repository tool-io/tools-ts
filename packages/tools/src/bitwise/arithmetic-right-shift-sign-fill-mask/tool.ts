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
  readonly shift: number;
  readonly negative: boolean;
};
export type Output = { readonly fillMask: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "integer", minimum: 1, maximum: 128 },
    shift: { type: "integer", minimum: 0 },
    negative: { type: "boolean" },
  },
  required: ["width", "shift", "negative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fillMask: { type: "string", maxLength: 8192 } },
  required: ["fillMask"],
} as const;
/** Compute arithmetic right shift sign fill mask from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { width, shift, negative } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    integer(shift, 0, width);
    const all = (1n << BigInt(width)) - 1n;
    return {
      fillMask: (negative
        ? all ^ ((1n << BigInt(width - shift)) - 1n)
        : 0n
      ).toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { width: 8, shift: 3, negative: true },
  output: { fillMask: "224" },
} satisfies ToolExample<Input, Output>;
export const arithmeticRightShiftSignFillMaskTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/arithmetic-right-shift-sign-fill-mask",
  title: "Arithmetic Right Shift Sign Fill Mask Tool",
  description:
    "Compute arithmetic right shift sign fill mask from explicit bounded inputs.",
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
        id: "shift",
        label: "Shift",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "negative",
        label: "Negative",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "fillMask", label: "Fill Mask", valueType: { type: "string" } },
    ],
  },
});
export const run = arithmeticRightShiftSignFillMaskTool.execute;
export default arithmeticRightShiftSignFillMaskTool;
