import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameIndex: number;
  readonly frameCount: number;
  readonly frameTimeMs: number;
  readonly firstFrameTimeMs: number;
};
export type Output = {
  readonly timeMs: number;
  readonly durationThroughFrameMs: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameIndex: { type: "integer", minimum: 0 },
    frameCount: { type: "integer", minimum: 1 },
    frameTimeMs: { type: "number", minimum: 0 },
    firstFrameTimeMs: { type: "number" },
  },
  required: ["frameIndex", "frameCount", "frameTimeMs", "firstFrameTimeMs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeMs: { type: "number" },
    durationThroughFrameMs: { type: "number" },
  },
  required: ["timeMs", "durationThroughFrameMs"],
} as const;
/** Constant Frame Time coordinate for one zero-based frame index; not a variable Frame Time Vector or acquisition datetime parser. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameIndex, frameCount, frameTimeMs, firstFrameTimeMs } = request;
  const compute = (): Output => {
    H.integer(frameCount, 1);
    H.integer(frameIndex, 0, frameCount - 1);
    H.domain(frameTimeMs >= 0);
    return {
      timeMs: firstFrameTimeMs + frameIndex * frameTimeMs,
      durationThroughFrameMs: (frameIndex + 1) * frameTimeMs,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frameIndex: 4,
    frameCount: 10,
    frameTimeMs: 40,
    firstFrameTimeMs: 100,
  },
  output: { timeMs: 260, durationThroughFrameMs: 200 },
} satisfies ToolExample<Input, Output>;
export const dicomFrameIncrementTimeIndexTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/dicom-frame-increment-time-index-term",
    title: "DICOM Frame Increment Time Index Term Tool",
    description:
      "Constant Frame Time coordinate for one zero-based frame index; not a variable Frame Time Vector or acquisition datetime parser.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameIndex: { type: "integer", minimum: 0 },
        frameCount: { type: "integer", minimum: 1 },
        frameTimeMs: { type: "number", minimum: 0 },
        firstFrameTimeMs: { type: "number" },
      },
      required: ["frameIndex", "frameCount", "frameTimeMs", "firstFrameTimeMs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeMs: { type: "number" },
        durationThroughFrameMs: { type: "number" },
      },
      required: ["timeMs", "durationThroughFrameMs"],
    },
    ports: {
      inputs: [
        {
          id: "frameIndex",
          label: "Frame Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameCount",
          label: "Frame Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameTimeMs",
          label: "Frame Time Ms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstFrameTimeMs",
          label: "First Frame Time Ms",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "timeMs", label: "Time Ms", valueType: { type: "number" } },
        {
          id: "durationThroughFrameMs",
          label: "Duration Through Frame Ms",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomFrameIncrementTimeIndexTermTool.execute;
export default dicomFrameIncrementTimeIndexTermTool;
