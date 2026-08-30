import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeekDiscAdvanceInput = Readonly<{
  readonly discPositions: number;
}>;
export type WeekDiscAdvanceOutput = Readonly<{
  readonly degreesPerWeek: number;
}>;

export const calculateWeekDiscAdvance = (
  x: WeekDiscAdvanceInput,
): WeekDiscAdvanceOutput => {
  if (
    !Number.isFinite(x.discPositions) ||
    !Number.isSafeInteger(x.discPositions) ||
    x.discPositions < 1
  )
    simpleError("discPositions", "Provide a positive safe integer.");
  const degreesPerWeek = 360 / x.discPositions;
  if (!Number.isFinite(degreesPerWeek))
    simpleError(
      "degreesPerWeek",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { degreesPerWeek: Object.is(degreesPerWeek, -0) ? 0 : degreesPerWeek };
};

export const example = {
  input: {
    discPositions: 52,
  },
  output: { degreesPerWeek: 6.923076923076923 },
} satisfies ToolExample<WeekDiscAdvanceInput, WeekDiscAdvanceOutput>;

export const tool = createSimpleTool({
  id: "horology/week-disc-advance",
  title: "Week Disc Advance",
  description:
    "Week-disc angular advance in degrees per weekly step for a specified number of positions.",
  inputs: [
    {
      id: "discPositions",
      kind: "integer",
      label: "Disc Positions",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "degreesPerWeek",
      kind: "number",
      label: "Degrees Per Week",
      unit: "deg/week",
    },
  ],
  calculate: (input) =>
    calculateWeekDiscAdvance({
      discPositions: input.discPositions as number,
    }),
});
export const weekDiscAdvanceTool = tool;
export const runWeekDiscAdvance = tool.execute;
export default tool;
