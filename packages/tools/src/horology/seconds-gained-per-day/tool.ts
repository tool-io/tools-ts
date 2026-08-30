import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SecondsGainedPerDayInput = Readonly<{
  readonly frequencyErrorPpm: number;
}>;
export type SecondsGainedPerDayOutput = Readonly<{
  readonly secondsPerDay: number;
}>;

export const calculateSecondsGainedPerDay = (
  x: SecondsGainedPerDayInput,
): SecondsGainedPerDayOutput => {
  if (!Number.isFinite(x.frequencyErrorPpm))
    simpleError("frequencyErrorPpm", "Provide a finite number.");
  const secondsPerDay = (x.frequencyErrorPpm * 86400) / 1000000;
  if (!Number.isFinite(secondsPerDay))
    simpleError(
      "secondsPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { secondsPerDay: Object.is(secondsPerDay, -0) ? 0 : secondsPerDay };
};

export const example = {
  input: {
    frequencyErrorPpm: 10,
  },
  output: { secondsPerDay: 0.864 },
} satisfies ToolExample<SecondsGainedPerDayInput, SecondsGainedPerDayOutput>;

export const tool = createSimpleTool({
  id: "horology/seconds-gained-per-day",
  title: "Seconds Gained Per Day",
  description:
    "Signed seconds gained per day from a frequency error in parts per million.",
  inputs: [
    {
      id: "frequencyErrorPpm",
      kind: "number",
      label: "Frequency Error Ppm",
      unit: "ppm",
    },
  ],
  outputs: [
    {
      id: "secondsPerDay",
      kind: "number",
      label: "Seconds Per Day",
      unit: "s/day",
    },
  ],
  calculate: (input) =>
    calculateSecondsGainedPerDay({
      frequencyErrorPpm: input.frequencyErrorPpm as number,
    }),
});
export const secondsGainedPerDayTool = tool;
export const runSecondsGainedPerDay = tool.execute;
export default tool;
