import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frames: number;
  readonly frameRate: number;
  readonly audioDelay: number;
};
export type Output = {
  readonly videoDelay: number;
  readonly relativeDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frames: { type: "integer", minimum: 0 },
    frameRate: { type: "number", exclusiveMinimum: 0 },
    audioDelay: { type: "number", minimum: 0 },
  },
  required: ["frames", "frameRate", "audioDelay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    videoDelay: { type: "number" },
    relativeDelay: { type: "number" },
  },
  required: ["videoDelay", "relativeDelay"],
} as const;
/** Calculate broadcast delay frame time crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frames, frameRate, audioDelay } = request;
  const compute = (): Output => {
    H.integer(frames, 0);
    H.positive(frameRate);
    H.domain(audioDelay >= 0);
    return {
      videoDelay: frames / frameRate,
      relativeDelay: frames / frameRate - audioDelay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frames: 3, frameRate: 25, audioDelay: 0.1 },
  output: { videoDelay: 0.12, relativeDelay: 0.01999999999999999 },
} satisfies ToolExample<Input, Output>;
export const broadcastDelayFrameTimeCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/broadcast-delay-frame-time-crosswalk",
    title: "Broadcast Delay Frame Time Crosswalk Tool",
    description:
      "Calculate broadcast delay frame time crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frames: { type: "integer", minimum: 0 },
        frameRate: { type: "number", exclusiveMinimum: 0 },
        audioDelay: { type: "number", minimum: 0 },
      },
      required: ["frames", "frameRate", "audioDelay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        videoDelay: { type: "number" },
        relativeDelay: { type: "number" },
      },
      required: ["videoDelay", "relativeDelay"],
    },
    ports: {
      inputs: [
        {
          id: "frames",
          label: "Frames",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameRate",
          label: "Frame Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "audioDelay",
          label: "Audio Delay",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "videoDelay",
          label: "Video Delay",
          valueType: { type: "number" },
        },
        {
          id: "relativeDelay",
          label: "Relative Delay",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = broadcastDelayFrameTimeCrosswalkTool.execute;
export default broadcastDelayFrameTimeCrosswalkTool;
