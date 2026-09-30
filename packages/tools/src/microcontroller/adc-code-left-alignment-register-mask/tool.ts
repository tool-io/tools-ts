import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly code: number;
  readonly bits: number;
  readonly registerBits: number;
};
export type Output = { readonly registerValue: number; readonly mask: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "integer", minimum: 0 },
    bits: { type: "integer", minimum: 1 },
    registerBits: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["code", "bits", "registerBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { registerValue: { type: "number" }, mask: { type: "number" } },
  required: ["registerValue", "mask"],
} as const;
/** Compute adc code left alignment register mask from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { code, bits, registerBits } = input;
  const compute = (): Output => {
    integer(registerBits, 1, 32);
    integer(bits, 1, registerBits);
    integer(code, 0, 2 ** bits - 1);
    const scale = 2 ** (registerBits - bits);
    return { registerValue: code * scale, mask: (2 ** bits - 1) * scale };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { code: 3, bits: 4, registerBits: 8 },
  output: { registerValue: 48, mask: 240 },
} satisfies ToolExample<Input, Output>;
export const adcCodeLeftAlignmentRegisterMaskTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/adc-code-left-alignment-register-mask",
  title: "ADC Code Left Alignment Register Mask Tool",
  description:
    "Compute adc code left alignment register mask from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "code",
        label: "Code",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "bits",
        label: "Bits",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "registerBits",
        label: "Register Bits",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "registerValue",
        label: "Register Value",
        valueType: { type: "number" },
      },
      { id: "mask", label: "Mask", valueType: { type: "number" } },
    ],
  },
});
export const run = adcCodeLeftAlignmentRegisterMaskTool.execute;
export default adcCodeLeftAlignmentRegisterMaskTool;
