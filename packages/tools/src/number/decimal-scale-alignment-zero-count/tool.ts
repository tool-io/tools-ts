import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly leftScale: number; readonly rightScale: number };
export type Output = {
  readonly commonScale: number;
  readonly leftZeros: number;
  readonly rightZeros: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftScale: { type: "integer", minimum: 0, maximum: 128 },
    rightScale: { type: "integer", minimum: 0, maximum: 128 },
  },
  required: ["leftScale", "rightScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonScale: { type: "integer" },
    leftZeros: { type: "integer" },
    rightZeros: { type: "integer" },
  },
  required: ["commonScale", "leftZeros", "rightZeros"],
} as const;
/** Compute decimal scale alignment zero count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leftScale, rightScale } = input;
  const compute = (): Output => {
    integer(leftScale, 0, 128);
    integer(rightScale, 0, 128);
    const commonScale = Math.max(leftScale, rightScale);
    return {
      commonScale,
      leftZeros: commonScale - leftScale,
      rightZeros: commonScale - rightScale,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftScale: 2, rightScale: 5 },
  output: { commonScale: 5, leftZeros: 3, rightZeros: 0 },
} satisfies ToolExample<Input, Output>;
export const decimalScaleAlignmentZeroCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/decimal-scale-alignment-zero-count",
  title: "Decimal Scale Alignment Zero Count Tool",
  description:
    "Compute decimal scale alignment zero count from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leftScale",
        label: "Left Scale",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightScale",
        label: "Right Scale",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "commonScale",
        label: "Common Scale",
        valueType: { type: "integer" },
      },
      { id: "leftZeros", label: "Left Zeros", valueType: { type: "integer" } },
      {
        id: "rightZeros",
        label: "Right Zeros",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = decimalScaleAlignmentZeroCountTool.execute;
export default decimalScaleAlignmentZeroCountTool;
