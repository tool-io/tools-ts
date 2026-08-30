import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DbGainFromAmplitudeRatioInput = Readonly<{
  readonly amplitudeRatio: number;
}>;
export type DbGainFromAmplitudeRatioOutput = Readonly<{
  readonly gainDecibels: number;
}>;

export const calculateDbGainFromAmplitudeRatio = (
  x: DbGainFromAmplitudeRatioInput,
): DbGainFromAmplitudeRatioOutput => {
  if (!Number.isFinite(x.amplitudeRatio) || x.amplitudeRatio <= 0)
    simpleError("amplitudeRatio", "Provide a finite positive number.");
  const gainDecibels = 20 * Math.log10(x.amplitudeRatio);
  if (!Number.isFinite(gainDecibels))
    simpleError(
      "gainDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { gainDecibels: Object.is(gainDecibels, -0) ? 0 : gainDecibels };
};

export const example = {
  input: {
    amplitudeRatio: 2,
  },
  output: { gainDecibels: 6.020599913279624 },
} satisfies ToolExample<
  DbGainFromAmplitudeRatioInput,
  DbGainFromAmplitudeRatioOutput
>;

export const tool = createSimpleTool({
  id: "music/db-gain-from-amplitude-ratio",
  title: "Db Gain From Amplitude Ratio",
  description:
    "Amplitude gain in decibels from a positive output/input amplitude ratio.",
  inputs: [
    {
      id: "amplitudeRatio",
      kind: "number",
      label: "Amplitude Ratio",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "gainDecibels", kind: "number", label: "Gain Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateDbGainFromAmplitudeRatio({
      amplitudeRatio: input.amplitudeRatio as number,
    }),
});
export const dbGainFromAmplitudeRatioTool = tool;
export const runDbGainFromAmplitudeRatio = tool.execute;
export default tool;
