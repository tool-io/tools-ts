import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstHz: number; readonly secondHz: number };
export type Output = { readonly ratio: number; readonly octaves: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstHz: { type: "number", exclusiveMinimum: 0 },
    secondHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstHz", "secondHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, octaves: { type: "number" } },
  required: ["ratio", "octaves"],
} as const;
/** Calculate audiometric frequency step ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstHz, secondHz } = request;
  const compute = (): Output => {
    H.positive(firstHz);
    H.positive(secondHz);
    return {
      ratio: secondHz / firstHz,
      octaves: Math.log2(secondHz) - Math.log2(firstHz),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstHz: 500, secondHz: 1000 },
  output: { ratio: 2, octaves: 1 },
} satisfies ToolExample<Input, Output>;
export const audiometricFrequencyStepRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/audiometric-frequency-step-ratio",
    title: "Audiometric Frequency Step Ratio Tool",
    description:
      "Calculate audiometric frequency step ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstHz: { type: "number", exclusiveMinimum: 0 },
        secondHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstHz", "secondHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" }, octaves: { type: "number" } },
      required: ["ratio", "octaves"],
    },
    ports: {
      inputs: [
        {
          id: "firstHz",
          label: "First Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHz",
          label: "Second Hz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "octaves", label: "Octaves", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = audiometricFrequencyStepRatioTool.execute;
export default audiometricFrequencyStepRatioTool;
