import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalRuntimeMinutes: number;
  readonly suppliedPlaybackSpeed: number;
};
export type Output = {
  readonly playbackRuntimeMinutes: number;
  readonly runtimeRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalRuntimeMinutes: { type: "number", minimum: 0 },
    suppliedPlaybackSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["originalRuntimeMinutes", "suppliedPlaybackSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    playbackRuntimeMinutes: { type: "number" },
    runtimeRatio: { type: "number" },
  },
  required: ["playbackRuntimeMinutes", "runtimeRatio"],
} as const;
/** Convert an explicit audio runtime to a supplied constant playback speed without selecting an accessibility preference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalRuntimeMinutes, suppliedPlaybackSpeed } = request;
  const compute = (): Output => {
    H.domain(originalRuntimeMinutes >= 0, "originalRuntimeMinutes");
    (H.domain(
      Number.isFinite(suppliedPlaybackSpeed) && suppliedPlaybackSpeed > 0,
      "suppliedPlaybackSpeed",
    ),
      suppliedPlaybackSpeed);
    return {
      playbackRuntimeMinutes: originalRuntimeMinutes / suppliedPlaybackSpeed,
      runtimeRatio: 1 / suppliedPlaybackSpeed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalRuntimeMinutes: 60, suppliedPlaybackSpeed: 1.5 },
  output: { playbackRuntimeMinutes: 40, runtimeRatio: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const accessibleAudioSpeedRuntimeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["disability-studies", "disability studies", "social sciences"],
      keywords: ["disability studies", "social sciences"],
    },
    id: "disability-studies/accessible-audio-speed-runtime-ratio",
    title: "Accessible Audio Speed Runtime Ratio",
    description:
      "Convert an explicit audio runtime to a supplied constant playback speed without selecting an accessibility preference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalRuntimeMinutes: { type: "number", minimum: 0 },
        suppliedPlaybackSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["originalRuntimeMinutes", "suppliedPlaybackSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        playbackRuntimeMinutes: { type: "number" },
        runtimeRatio: { type: "number" },
      },
      required: ["playbackRuntimeMinutes", "runtimeRatio"],
    },
    ports: {
      inputs: [
        {
          id: "originalRuntimeMinutes",
          label: "Original Runtime Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPlaybackSpeed",
          label: "Supplied Playback Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "playbackRuntimeMinutes",
          label: "Playback Runtime Minutes",
          valueType: { type: "number" },
        },
        {
          id: "runtimeRatio",
          label: "Runtime Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = accessibleAudioSpeedRuntimeRatioTool.execute;
export default accessibleAudioSpeedRuntimeRatioTool;
