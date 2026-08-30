import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DayDiscAdvanceRateInput = Readonly<{
  readonly discPositions: number;
}>;
export type DayDiscAdvanceRateOutput = Readonly<{
  readonly degreesPerDay: number;
}>;

export const calculateDayDiscAdvanceRate = (
  x: DayDiscAdvanceRateInput,
): DayDiscAdvanceRateOutput => {
  if (
    !Number.isFinite(x.discPositions) ||
    !Number.isSafeInteger(x.discPositions) ||
    x.discPositions < 1
  )
    simpleError("discPositions", "Provide a positive safe integer.");
  const degreesPerDay = 360 / x.discPositions;
  if (!Number.isFinite(degreesPerDay))
    simpleError(
      "degreesPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { degreesPerDay: Object.is(degreesPerDay, -0) ? 0 : degreesPerDay };
};

export const example = {
  input: {
    discPositions: 31,
  },
  output: { degreesPerDay: 11.612903225806452 },
} satisfies ToolExample<DayDiscAdvanceRateInput, DayDiscAdvanceRateOutput>;

export const tool = createSimpleTool({
  id: "horology/day-disc-advance-rate",
  title: "Day Disc Advance Rate",
  description:
    "Day-disc angular advance in degrees per daily step for a specified number of disc positions.",
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
      id: "degreesPerDay",
      kind: "number",
      label: "Degrees Per Day",
      unit: "deg/day",
    },
  ],
  calculate: (input) =>
    calculateDayDiscAdvanceRate({
      discPositions: input.discPositions as number,
    }),
});
export const dayDiscAdvanceRateTool = tool;
export const runDayDiscAdvanceRate = tool.execute;
export default tool;
