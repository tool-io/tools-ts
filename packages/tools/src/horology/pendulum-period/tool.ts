import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PendulumPeriodInput = Readonly<{
  readonly lengthMeters: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type PendulumPeriodOutput = Readonly<{
  readonly periodSeconds: number;
}>;

export const calculatePendulumPeriod = (
  x: PendulumPeriodInput,
): PendulumPeriodOutput => {
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters <= 0)
    simpleError("lengthMeters", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared <= 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite positive number.",
    );
  const periodSeconds =
    2 * Math.PI * Math.sqrt(x.lengthMeters / x.gravityMetersPerSecondSquared);
  if (!Number.isFinite(periodSeconds))
    simpleError(
      "periodSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { periodSeconds: Object.is(periodSeconds, -0) ? 0 : periodSeconds };
};

export const example = {
  input: {
    lengthMeters: 1,
    gravityMetersPerSecondSquared: 9.80665,
  },
  output: { periodSeconds: 2.0064092925890407 },
} satisfies ToolExample<PendulumPeriodInput, PendulumPeriodOutput>;

export const tool = createSimpleTool({
  id: "horology/pendulum-period",
  title: "Pendulum Period",
  description:
    "Small-angle ideal pendulum period in seconds from effective length and local gravitational acceleration.",
  inputs: [
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
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
    { id: "periodSeconds", kind: "number", label: "Period Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculatePendulumPeriod({
      lengthMeters: input.lengthMeters as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const pendulumPeriodTool = tool;
export const runPendulumPeriod = tool.execute;
export default tool;
