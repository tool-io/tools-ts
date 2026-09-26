import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingMinutes: number;
  readonly playbackSpeed: number;
  readonly pauseMinutes: number;
};
export type Output = { readonly totalMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingMinutes: { type: "number", minimum: 0 },
    playbackSpeed: { type: "number", exclusiveMinimum: 0 },
    pauseMinutes: { type: "number", minimum: 0 },
  },
  required: ["recordingMinutes", "playbackSpeed", "pauseMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalMinutes: { type: "number" } },
  required: ["totalMinutes"],
} as const;
/** Calculate lecture playback time pause adjustment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingMinutes, playbackSpeed, pauseMinutes } = request;
  const compute = (): Output => {
    H.domain(recordingMinutes >= 0 && pauseMinutes >= 0);
    H.positive(playbackSpeed);
    return { totalMinutes: recordingMinutes / playbackSpeed + pauseMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordingMinutes: 60, playbackSpeed: 1.5, pauseMinutes: 10 },
  output: { totalMinutes: 50 },
} satisfies ToolExample<Input, Output>;
export const lecturePlaybackTimePauseAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/lecture-playback-time-pause-adjustment",
    title: "Lecture Playback Time Pause Adjustment Tool",
    description:
      "Calculate lecture playback time pause adjustment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordingMinutes: { type: "number", minimum: 0 },
        playbackSpeed: { type: "number", exclusiveMinimum: 0 },
        pauseMinutes: { type: "number", minimum: 0 },
      },
      required: ["recordingMinutes", "playbackSpeed", "pauseMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalMinutes: { type: "number" } },
      required: ["totalMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "recordingMinutes",
          label: "Recording Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "playbackSpeed",
          label: "Playback Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseMinutes",
          label: "Pause Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalMinutes",
          label: "Total Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lecturePlaybackTimePauseAdjustmentTool.execute;
export default lecturePlaybackTimePauseAdjustmentTool;
