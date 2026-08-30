import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PendulumLengthFromPeriodInput = Readonly<{
  readonly periodSeconds: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type PendulumLengthFromPeriodOutput = Readonly<{
  readonly lengthMeters: number;
}>;

export const calculatePendulumLengthFromPeriod = (
  x: PendulumLengthFromPeriodInput,
): PendulumLengthFromPeriodOutput => {
  if (!Number.isFinite(x.periodSeconds) || x.periodSeconds <= 0)
    simpleError("periodSeconds", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared <= 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite positive number.",
    );
  const lengthMeters =
    x.gravityMetersPerSecondSquared * (x.periodSeconds / (2 * Math.PI)) ** 2;
  if (!Number.isFinite(lengthMeters))
    simpleError(
      "lengthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lengthMeters: Object.is(lengthMeters, -0) ? 0 : lengthMeters };
};

export const example = {
  input: {
    periodSeconds: 2,
    gravityMetersPerSecondSquared: 9.80665,
  },
  output: { lengthMeters: 0.9936213855661318 },
} satisfies ToolExample<
  PendulumLengthFromPeriodInput,
  PendulumLengthFromPeriodOutput
>;

export const tool = createSimpleTool({
  id: "horology/pendulum-length-from-period",
  title: "Pendulum Length From Period",
  description:
    "Effective small-angle pendulum length for a target complete oscillation period.",
  inputs: [
    {
      id: "periodSeconds",
      kind: "number",
      label: "Period Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "gravityMetersPerSecondSquared",
      kind: "number",
      label: "Gravity Meters Per Second Squared",
      unit: "m/s2",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lengthMeters", kind: "number", label: "Length Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculatePendulumLengthFromPeriod({
      periodSeconds: input.periodSeconds as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const pendulumLengthFromPeriodTool = tool;
export const runPendulumLengthFromPeriod = tool.execute;
export default tool;
