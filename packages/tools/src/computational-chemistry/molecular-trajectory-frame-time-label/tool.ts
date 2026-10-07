import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameIndex: number;
  readonly firstFrameIndex: number;
  readonly firstFrameTime: number;
  readonly timePerFrame: number;
  readonly unit: string;
};
export type Output = { readonly time: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameIndex: { type: "integer", minimum: 0 },
    firstFrameIndex: { type: "integer", minimum: 0 },
    firstFrameTime: { type: "number" },
    timePerFrame: { type: "number", exclusiveMinimum: 0 },
    unit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "frameIndex",
    "firstFrameIndex",
    "firstFrameTime",
    "timePerFrame",
    "unit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["time", "label"],
} as const;
/** Map an explicit trajectory frame index to a uniformly spaced time origin without reading a trajectory file. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameIndex, firstFrameIndex, firstFrameTime, timePerFrame, unit } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(frameIndex) &&
        frameIndex >= 0 &&
        frameIndex <= Number.MAX_SAFE_INTEGER,
      "frameIndex",
    ),
      frameIndex);
    (H.domain(
      Number.isSafeInteger(firstFrameIndex) &&
        firstFrameIndex >= 0 &&
        firstFrameIndex <= Number.MAX_SAFE_INTEGER,
      "firstFrameIndex",
    ),
      firstFrameIndex);
    (H.domain(timePerFrame > 0, "timePerFrame"), timePerFrame);
    H.domain(unit.length > 0, "unit");
    const time = firstFrameTime + (frameIndex - firstFrameIndex) * timePerFrame;
    return { time, label: "frame " + frameIndex + " at " + time + " " + unit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frameIndex: 12,
    firstFrameIndex: 0,
    firstFrameTime: 0,
    timePerFrame: 0.5,
    unit: "ps",
  },
  output: { time: 6, label: "frame 12 at 6 ps" },
} satisfies ToolExample<Input, Output>;
export const molecularTrajectoryFrameTimeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/molecular-trajectory-frame-time-label",
    title: "Molecular Trajectory Frame Time Label",
    description:
      "Map an explicit trajectory frame index to a uniformly spaced time origin without reading a trajectory file.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameIndex: { type: "integer", minimum: 0 },
        firstFrameIndex: { type: "integer", minimum: 0 },
        firstFrameTime: { type: "number" },
        timePerFrame: { type: "number", exclusiveMinimum: 0 },
        unit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "frameIndex",
        "firstFrameIndex",
        "firstFrameTime",
        "timePerFrame",
        "unit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["time", "label"],
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
          id: "firstFrameIndex",
          label: "First Frame Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstFrameTime",
          label: "First Frame Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timePerFrame",
          label: "Time Per Frame",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "time", label: "Time", valueType: { type: "number" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = molecularTrajectoryFrameTimeLabelTool.execute;
export default molecularTrajectoryFrameTimeLabelTool;
