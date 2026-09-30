import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly bits: number; readonly code: number };
export type Output = {
  readonly negativeHeadroom: number;
  readonly positiveHeadroom: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bits: { type: "integer", minimum: 2, maximum: 32 },
    code: { type: "integer" },
  },
  required: ["bits", "code"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negativeHeadroom: { type: "number" },
    positiveHeadroom: { type: "number" },
  },
  required: ["negativeHeadroom", "positiveHeadroom"],
} as const;
/** Compute adc signed differential full scale gap from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { bits, code } = input;
  const compute = (): Output => {
    integer(bits, 2, 32);
    const half = 2 ** (bits - 1);
    integer(code, -half, half - 1);
    return { negativeHeadroom: code + half, positiveHeadroom: half - 1 - code };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bits: 8, code: -128 },
  output: { negativeHeadroom: 0, positiveHeadroom: 255 },
} satisfies ToolExample<Input, Output>;
export const adcSignedDifferentialFullScaleGapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/adc-signed-differential-full-scale-gap",
  title: "ADC Signed Differential Full Scale Gap Tool",
  description:
    "Compute adc signed differential full scale gap from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bits",
        label: "Bits",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "code",
        label: "Code",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "negativeHeadroom",
        label: "Negative Headroom",
        valueType: { type: "number" },
      },
      {
        id: "positiveHeadroom",
        label: "Positive Headroom",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = adcSignedDifferentialFullScaleGapTool.execute;
export default adcSignedDifferentialFullScaleGapTool;
