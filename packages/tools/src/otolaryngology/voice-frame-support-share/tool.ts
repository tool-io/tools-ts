import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameStarts: readonly number[];
  readonly frameDuration: number;
  readonly recordingStart: number;
  readonly recordingEnd: number;
  readonly valid: readonly boolean[];
};
export type Output = {
  readonly frames: number;
  readonly completeFrames: number;
  readonly validCompleteFrames: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameStarts: { type: "array", maxItems: 256, items: { type: "number" } },
    frameDuration: { type: "number", exclusiveMinimum: 0 },
    recordingStart: { type: "number" },
    recordingEnd: { type: "number" },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "frameStarts",
    "frameDuration",
    "recordingStart",
    "recordingEnd",
    "valid",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frames: { type: "integer" },
    completeFrames: { type: "integer" },
    validCompleteFrames: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "frames",
    "completeFrames",
    "validCompleteFrames",
    "share",
    "defined",
  ],
} as const;
/** Calculate voice frame support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameStarts, frameDuration, recordingStart, recordingEnd, valid } =
    request;
  const compute = (): Output => {
    H.sameLength(frameStarts, valid);
    H.positive(frameDuration);
    H.domain(recordingEnd >= recordingStart);
    return (() => {
      const complete = frameStarts.map(
          (x) => x >= recordingStart && x + frameDuration <= recordingEnd,
        ),
        completeFrames = complete.filter(Boolean).length,
        validCompleteFrames = complete.filter((x, i) => x && valid[i]).length;
      return {
        frames: frameStarts.length,
        completeFrames,
        validCompleteFrames,
        share: completeFrames > 0 ? validCompleteFrames / completeFrames : 0,
        defined: completeFrames > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frameStarts: [0, 1, 2],
    frameDuration: 1,
    recordingStart: 0,
    recordingEnd: 2,
    valid: [true, false, true],
  },
  output: {
    frames: 3,
    completeFrames: 2,
    validCompleteFrames: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const voiceFrameSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/voice-frame-support-share",
    title: "Voice Frame Support Share Tool",
    description:
      "Calculate voice frame support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameStarts: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        frameDuration: { type: "number", exclusiveMinimum: 0 },
        recordingStart: { type: "number" },
        recordingEnd: { type: "number" },
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: [
        "frameStarts",
        "frameDuration",
        "recordingStart",
        "recordingEnd",
        "valid",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frames: { type: "integer" },
        completeFrames: { type: "integer" },
        validCompleteFrames: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "frames",
        "completeFrames",
        "validCompleteFrames",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "frameStarts",
          label: "Frame Starts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "frameDuration",
          label: "Frame Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordingStart",
          label: "Recording Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordingEnd",
          label: "Recording End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "frames", label: "Frames", valueType: { type: "integer" } },
        {
          id: "completeFrames",
          label: "Complete Frames",
          valueType: { type: "integer" },
        },
        {
          id: "validCompleteFrames",
          label: "Valid Complete Frames",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = voiceFrameSupportShareTool.execute;
export default voiceFrameSupportShareTool;
