import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JumpingHourAdvanceRateInput = Readonly<{
  readonly hoursPerJump: number;
}>;
export type JumpingHourAdvanceRateOutput = Readonly<{
  readonly jumpsPerDay: number;
}>;

export const calculateJumpingHourAdvanceRate = (
  x: JumpingHourAdvanceRateInput,
): JumpingHourAdvanceRateOutput => {
  if (!Number.isFinite(x.hoursPerJump) || x.hoursPerJump <= 0)
    simpleError("hoursPerJump", "Provide a finite positive number.");
  const jumpsPerDay = 24 / x.hoursPerJump;
  if (!Number.isFinite(jumpsPerDay))
    simpleError(
      "jumpsPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { jumpsPerDay: Object.is(jumpsPerDay, -0) ? 0 : jumpsPerDay };
};

export const example = {
  input: {
    hoursPerJump: 1,
  },
  output: { jumpsPerDay: 24 },
} satisfies ToolExample<
  JumpingHourAdvanceRateInput,
  JumpingHourAdvanceRateOutput
>;

export const tool = createSimpleTool({
  id: "horology/jumping-hour-advance-rate",
  title: "Jumping Hour Advance Rate",
  description:
    "Average jumping-hour advances per day for a specified hours-per-jump interval.",
  inputs: [
    {
      id: "hoursPerJump",
      kind: "number",
      label: "Hours Per Jump",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "jumpsPerDay",
      kind: "number",
      label: "Jumps Per Day",
      unit: "jump/day",
    },
  ],
  calculate: (input) =>
    calculateJumpingHourAdvanceRate({
      hoursPerJump: input.hoursPerJump as number,
    }),
});
export const jumpingHourAdvanceRateTool = tool;
export const runJumpingHourAdvanceRate = tool.execute;
export default tool;
