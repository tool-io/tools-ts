import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DualTimeDifferenceInput = Readonly<{
  readonly firstHour: number;
  readonly secondHour: number;
}>;
export type DualTimeDifferenceOutput = Readonly<{
  readonly differenceHours: number;
}>;

export const calculateDualTimeDifference = (
  x: DualTimeDifferenceInput,
): DualTimeDifferenceOutput => {
  if (!Number.isFinite(x.firstHour) || x.firstHour < 0)
    simpleError("firstHour", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.secondHour) || x.secondHour < 0)
    simpleError("secondHour", "Provide a finite nonnegative number.");
  if (!(x.firstHour < 24 && x.secondHour < 24))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const differenceHours =
    ((((x.secondHour - x.firstHour + 12) % 24) + 24) % 24) - 12;
  if (!Number.isFinite(differenceHours))
    simpleError(
      "differenceHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    differenceHours: Object.is(differenceHours, -0) ? 0 : differenceHours,
  };
};

export const example = {
  input: {
    firstHour: 10,
    secondHour: 15,
  },
  output: { differenceHours: 5 },
} satisfies ToolExample<DualTimeDifferenceInput, DualTimeDifferenceOutput>;

export const tool = createSimpleTool({
  id: "horology/dual-time-difference",
  title: "Dual Time Difference",
  description:
    "Shortest signed hour difference from a first 24-hour clock reading to a second reading, in [-12,12).",
  inputs: [
    { id: "firstHour", kind: "number", label: "First Hour", minimum: 0 },
    { id: "secondHour", kind: "number", label: "Second Hour", minimum: 0 },
  ],
  outputs: [
    {
      id: "differenceHours",
      kind: "number",
      label: "Difference Hours",
      unit: "h",
    },
  ],
  calculate: (input) =>
    calculateDualTimeDifference({
      firstHour: input.firstHour as number,
      secondHour: input.secondHour as number,
    }),
});
export const dualTimeDifferenceTool = tool;
export const runDualTimeDifference = tool.execute;
export default tool;
