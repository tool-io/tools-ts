import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SweepStepsPerSecondInput = Readonly<{
  readonly beatsPerHour: number;
}>;
export type SweepStepsPerSecondOutput = Readonly<{
  readonly stepsPerSecond: number;
}>;

export const calculateSweepStepsPerSecond = (
  x: SweepStepsPerSecondInput,
): SweepStepsPerSecondOutput => {
  if (!Number.isFinite(x.beatsPerHour) || x.beatsPerHour <= 0)
    simpleError("beatsPerHour", "Provide a finite positive number.");
  const stepsPerSecond = x.beatsPerHour / 3600;
  if (!Number.isFinite(stepsPerSecond))
    simpleError(
      "stepsPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { stepsPerSecond: Object.is(stepsPerSecond, -0) ? 0 : stepsPerSecond };
};

export const example = {
  input: {
    beatsPerHour: 28800,
  },
  output: { stepsPerSecond: 8 },
} satisfies ToolExample<SweepStepsPerSecondInput, SweepStepsPerSecondOutput>;

export const tool = createSimpleTool({
  id: "horology/sweep-steps-per-second",
  title: "Sweep Steps Per Second",
  description:
    "Watch seconds-hand movement steps per second when each balance beat advances the hand once.",
  inputs: [
    {
      id: "beatsPerHour",
      kind: "number",
      label: "Beats Per Hour",
      unit: "bph",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stepsPerSecond",
      kind: "number",
      label: "Steps Per Second",
      unit: "1/s",
    },
  ],
  calculate: (input) =>
    calculateSweepStepsPerSecond({
      beatsPerHour: input.beatsPerHour as number,
    }),
});
export const sweepStepsPerSecondTool = tool;
export const runSweepStepsPerSecond = tool.execute;
export default tool;
