import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantum: number;
  readonly suppliedScale: number;
  readonly bias: number;
};
export type Output = {
  readonly lowerError: number;
  readonly upperError: number;
  readonly halfBand: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantum: { type: "number", minimum: 0 },
    suppliedScale: { type: "number" },
    bias: { type: "number" },
  },
  required: ["quantum", "suppliedScale", "bias"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerError: { type: "number" },
    upperError: { type: "number" },
    halfBand: { type: "number" },
  },
  required: ["lowerError", "upperError", "halfBand"],
} as const;
/** Bound supplied nearest-step quantization error with an explicit scale and bias, without inferring sensor accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantum, suppliedScale, bias } = request;
  const compute = (): Output => {
    H.domain(quantum >= 0);
    return {
      lowerError: bias - (quantum * Math.abs(suppliedScale)) / 2,
      upperError: bias + (quantum * Math.abs(suppliedScale)) / 2,
      halfBand: (quantum * Math.abs(suppliedScale)) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantum: 2, suppliedScale: -3, bias: 1 },
  output: { lowerError: -2, upperError: 4, halfBand: 3 },
} satisfies ToolExample<Input, Output>;
export const sensorQuantizationErrorHalfbandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/sensor-quantization-error-halfband",
    title: "Sensor Quantization Error Halfband Tool",
    description:
      "Bound supplied nearest-step quantization error with an explicit scale and bias, without inferring sensor accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantum: { type: "number", minimum: 0 },
        suppliedScale: { type: "number" },
        bias: { type: "number" },
      },
      required: ["quantum", "suppliedScale", "bias"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerError: { type: "number" },
        upperError: { type: "number" },
        halfBand: { type: "number" },
      },
      required: ["lowerError", "upperError", "halfBand"],
    },
    ports: {
      inputs: [
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bias",
          label: "Bias",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerError",
          label: "Lower Error",
          valueType: { type: "number" },
        },
        {
          id: "upperError",
          label: "Upper Error",
          valueType: { type: "number" },
        },
        { id: "halfBand", label: "Half Band", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sensorQuantizationErrorHalfbandTool.execute;
export default sensorQuantizationErrorHalfbandTool;
