import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly timeSeconds: number;
  readonly frameRate: number;
};
export type Output = {
  readonly nearestFrame: number;
  readonly quantizedSeconds: number;
  readonly errorSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeSeconds: { type: "number" },
    frameRate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["timeSeconds", "frameRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nearestFrame: { type: "integer" },
    quantizedSeconds: { type: "number" },
    errorSeconds: { type: "number" },
  },
  required: ["nearestFrame", "quantizedSeconds", "errorSeconds"],
} as const;
/** Quantize a supplied stimulus timestamp to nearest frame with half ties toward positive infinity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { timeSeconds, frameRate } = request;
  const compute = (): Output => {
    H.positive(frameRate);
    return {
      nearestFrame: Math.round(timeSeconds * frameRate),
      quantizedSeconds: Math.round(timeSeconds * frameRate) / frameRate,
      errorSeconds:
        Math.round(timeSeconds * frameRate) / frameRate - timeSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { timeSeconds: 1.25, frameRate: 2 },
  output: { nearestFrame: 3, quantizedSeconds: 1.5, errorSeconds: 0.25 },
} satisfies ToolExample<Input, Output>;
export const stimulusFrameQuantizationErrorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/stimulus-frame-quantization-error",
    title: "Stimulus Frame Quantization Error Tool",
    description:
      "Quantize a supplied stimulus timestamp to nearest frame with half ties toward positive infinity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeSeconds: { type: "number" },
        frameRate: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["timeSeconds", "frameRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nearestFrame: { type: "integer" },
        quantizedSeconds: { type: "number" },
        errorSeconds: { type: "number" },
      },
      required: ["nearestFrame", "quantizedSeconds", "errorSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "timeSeconds",
          label: "Time Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frameRate",
          label: "Frame Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nearestFrame",
          label: "Nearest Frame",
          valueType: { type: "integer" },
        },
        {
          id: "quantizedSeconds",
          label: "Quantized Seconds",
          valueType: { type: "number" },
        },
        {
          id: "errorSeconds",
          label: "Error Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stimulusFrameQuantizationErrorTool.execute;
export default stimulusFrameQuantizationErrorTool;
