import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LoudnessLufsStreamingTargetOffsetInput = Readonly<{
  readonly measuredLufs: number;
  readonly targetLufs: number;
}>;
export type LoudnessLufsStreamingTargetOffsetOutput = Readonly<{
  readonly gainDecibels: number;
}>;

export const calculateLoudnessLufsStreamingTargetOffset = (
  x: LoudnessLufsStreamingTargetOffsetInput,
): LoudnessLufsStreamingTargetOffsetOutput => {
  if (!Number.isFinite(x.measuredLufs))
    simpleError("measuredLufs", "Provide a finite number.");
  if (!Number.isFinite(x.targetLufs))
    simpleError("targetLufs", "Provide a finite number.");
  const gainDecibels = x.targetLufs - x.measuredLufs;
  if (!Number.isFinite(gainDecibels))
    simpleError(
      "gainDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { gainDecibels: Object.is(gainDecibels, -0) ? 0 : gainDecibels };
};

export const example = {
  input: {
    measuredLufs: -18,
    targetLufs: -14,
  },
  output: { gainDecibels: 4 },
} satisfies ToolExample<
  LoudnessLufsStreamingTargetOffsetInput,
  LoudnessLufsStreamingTargetOffsetOutput
>;

export const tool = createSimpleTool({
  id: "music/loudness-lufs-streaming-target-offset",
  title: "Loudness Lufs Streaming Target Offset",
  description:
    "Signed gain in dB required to move a measured integrated LUFS value to a chosen target, before true-peak limiting.",
  inputs: [
    {
      id: "measuredLufs",
      kind: "number",
      label: "Measured Lufs",
      unit: "LUFS",
    },
    { id: "targetLufs", kind: "number", label: "Target Lufs", unit: "LUFS" },
  ],
  outputs: [
    { id: "gainDecibels", kind: "number", label: "Gain Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateLoudnessLufsStreamingTargetOffset({
      measuredLufs: input.measuredLufs as number,
      targetLufs: input.targetLufs as number,
    }),
});
export const loudnessLufsStreamingTargetOffsetTool = tool;
export const runLoudnessLufsStreamingTargetOffset = tool.execute;
export default tool;
