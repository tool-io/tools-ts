import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChronoElapsedFromStepsInput = Readonly<{
  readonly beatSteps: number;
  readonly beatsPerHour: number;
}>;
export type ChronoElapsedFromStepsOutput = Readonly<{
  readonly elapsedSeconds: number;
}>;

export const calculateChronoElapsedFromSteps = (
  x: ChronoElapsedFromStepsInput,
): ChronoElapsedFromStepsOutput => {
  if (!Number.isFinite(x.beatSteps) || x.beatSteps < 0)
    simpleError("beatSteps", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.beatsPerHour) || x.beatsPerHour <= 0)
    simpleError("beatsPerHour", "Provide a finite positive number.");
  if (!Number.isInteger(x.beatSteps))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const elapsedSeconds = (3600 * x.beatSteps) / x.beatsPerHour;
  if (!Number.isFinite(elapsedSeconds))
    simpleError(
      "elapsedSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { elapsedSeconds: Object.is(elapsedSeconds, -0) ? 0 : elapsedSeconds };
};

export const example = {
  input: {
    beatSteps: 80,
    beatsPerHour: 28800,
  },
  output: { elapsedSeconds: 10 },
} satisfies ToolExample<
  ChronoElapsedFromStepsInput,
  ChronoElapsedFromStepsOutput
>;

export const tool = createSimpleTool({
  id: "horology/chrono-elapsed-from-steps",
  title: "Chrono Elapsed From Steps",
  description:
    "Elapsed stopwatch time in seconds from beat-counted steps at a known beats-per-hour rate.",
  inputs: [
    { id: "beatSteps", kind: "number", label: "Beat Steps", minimum: 0 },
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
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateChronoElapsedFromSteps({
      beatSteps: input.beatSteps as number,
      beatsPerHour: input.beatsPerHour as number,
    }),
});
export const chronoElapsedFromStepsTool = tool;
export const runChronoElapsedFromSteps = tool.execute;
export default tool;
