import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeatsPerDayInput = Readonly<{
  readonly beatsPerHour: number;
}>;
export type BeatsPerDayOutput = Readonly<{
  readonly beatsPerDay: number;
}>;

export const calculateBeatsPerDay = (
  x: BeatsPerDayInput,
): BeatsPerDayOutput => {
  if (!Number.isFinite(x.beatsPerHour) || x.beatsPerHour <= 0)
    simpleError("beatsPerHour", "Provide a finite positive number.");
  const beatsPerDay = 24 * x.beatsPerHour;
  if (!Number.isFinite(beatsPerDay))
    simpleError(
      "beatsPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { beatsPerDay: Object.is(beatsPerDay, -0) ? 0 : beatsPerDay };
};

export const example = {
  input: {
    beatsPerHour: 28800,
  },
  output: { beatsPerDay: 691200 },
} satisfies ToolExample<BeatsPerDayInput, BeatsPerDayOutput>;

export const tool = createSimpleTool({
  id: "horology/beats-per-day",
  title: "Beats Per Day",
  description: "Total watch beats in a 24-hour day from beats per hour.",
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
      id: "beatsPerDay",
      kind: "number",
      label: "Beats Per Day",
      unit: "beat/day",
    },
  ],
  calculate: (input) =>
    calculateBeatsPerDay({
      beatsPerHour: input.beatsPerHour as number,
    }),
});
export const beatsPerDayTool = tool;
export const runBeatsPerDay = tool.execute;
export default tool;
