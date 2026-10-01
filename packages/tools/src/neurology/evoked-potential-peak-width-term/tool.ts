import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftCrossing: number;
  readonly rightCrossing: number;
  readonly peakTime: number;
  readonly sampleSeconds: number;
};
export type Output = {
  readonly width: number;
  readonly leftHalf: number;
  readonly rightHalf: number;
  readonly widthSamples: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftCrossing: { type: "number" },
    rightCrossing: { type: "number" },
    peakTime: { type: "number" },
    sampleSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["leftCrossing", "rightCrossing", "peakTime", "sampleSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    leftHalf: { type: "number" },
    rightHalf: { type: "number" },
    widthSamples: { type: "number" },
  },
  required: ["width", "leftHalf", "rightHalf", "widthSamples"],
} as const;
/** Width between caller-selected waveform crossings around an explicit peak; no crossing level or peak detector is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftCrossing, rightCrossing, peakTime, sampleSeconds } = request;
  const compute = (): Output => {
    H.domain(
      rightCrossing >= leftCrossing &&
        peakTime >= leftCrossing &&
        peakTime <= rightCrossing,
    );
    H.positive(sampleSeconds);
    return {
      width: rightCrossing - leftCrossing,
      leftHalf: peakTime - leftCrossing,
      rightHalf: rightCrossing - peakTime,
      widthSamples: (rightCrossing - leftCrossing) / sampleSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leftCrossing: 0.1,
    rightCrossing: 0.14,
    peakTime: 0.12,
    sampleSeconds: 0.001,
  },
  output: {
    width: 0.04000000000000001,
    leftHalf: 0.01999999999999999,
    rightHalf: 0.020000000000000018,
    widthSamples: 40.00000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const evokedPotentialPeakWidthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/evoked-potential-peak-width-term",
    title: "Evoked Potential Peak Width Term Tool",
    description:
      "Width between caller-selected waveform crossings around an explicit peak; no crossing level or peak detector is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftCrossing: { type: "number" },
        rightCrossing: { type: "number" },
        peakTime: { type: "number" },
        sampleSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["leftCrossing", "rightCrossing", "peakTime", "sampleSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        leftHalf: { type: "number" },
        rightHalf: { type: "number" },
        widthSamples: { type: "number" },
      },
      required: ["width", "leftHalf", "rightHalf", "widthSamples"],
    },
    ports: {
      inputs: [
        {
          id: "leftCrossing",
          label: "Left Crossing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightCrossing",
          label: "Right Crossing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "peakTime",
          label: "Peak Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleSeconds",
          label: "Sample Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "leftHalf", label: "Left Half", valueType: { type: "number" } },
        { id: "rightHalf", label: "Right Half", valueType: { type: "number" } },
        {
          id: "widthSamples",
          label: "Width Samples",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = evokedPotentialPeakWidthTermTool.execute;
export default evokedPotentialPeakWidthTermTool;
