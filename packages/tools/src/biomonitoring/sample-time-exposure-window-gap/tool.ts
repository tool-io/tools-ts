import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTime: number;
  readonly windowStart: number;
  readonly windowEnd: number;
};
export type Output = {
  readonly distanceToWindow: number;
  readonly signedFromStart: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTime: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
  },
  required: ["sampleTime", "windowStart", "windowEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceToWindow: { type: "number" },
    signedFromStart: { type: "number" },
    inside: { type: "boolean" },
  },
  required: ["distanceToWindow", "signedFromStart", "inside"],
} as const;
/** Calculate sample time exposure window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTime, windowStart, windowEnd } = request;
  const compute = (): Output => {
    H.domain(windowStart <= windowEnd);
    return {
      distanceToWindow:
        sampleTime < windowStart
          ? windowStart - sampleTime
          : sampleTime > windowEnd
            ? sampleTime - windowEnd
            : 0,
      signedFromStart: sampleTime - windowStart,
      inside: sampleTime >= windowStart && sampleTime <= windowEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleTime: 12, windowStart: 0, windowEnd: 10 },
  output: { distanceToWindow: 2, signedFromStart: 12, inside: false },
} satisfies ToolExample<Input, Output>;
export const sampleTimeExposureWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/sample-time-exposure-window-gap",
    title: "Sample Time Exposure Window Gap Tool",
    description:
      "Calculate sample time exposure window gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTime: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
      },
      required: ["sampleTime", "windowStart", "windowEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceToWindow: { type: "number" },
        signedFromStart: { type: "number" },
        inside: { type: "boolean" },
      },
      required: ["distanceToWindow", "signedFromStart", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTime",
          label: "Sample Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "distanceToWindow",
          label: "Distance To Window",
          valueType: { type: "number" },
        },
        {
          id: "signedFromStart",
          label: "Signed From Start",
          valueType: { type: "number" },
        },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = sampleTimeExposureWindowGapTool.execute;
export default sampleTimeExposureWindowGapTool;
