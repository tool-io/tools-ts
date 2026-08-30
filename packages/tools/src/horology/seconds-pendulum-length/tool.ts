import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SecondsPendulumLengthInput = Readonly<{
  readonly gravityMetersPerSecondSquared: number;
}>;
export type SecondsPendulumLengthOutput = Readonly<{
  readonly lengthMeters: number;
}>;

export const calculateSecondsPendulumLength = (
  x: SecondsPendulumLengthInput,
): SecondsPendulumLengthOutput => {
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared <= 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite positive number.",
    );
  const lengthMeters = x.gravityMetersPerSecondSquared / Math.PI ** 2;
  if (!Number.isFinite(lengthMeters))
    simpleError(
      "lengthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lengthMeters: Object.is(lengthMeters, -0) ? 0 : lengthMeters };
};

export const example = {
  input: {
    gravityMetersPerSecondSquared: 9.80665,
  },
  output: { lengthMeters: 0.9936213855661317 },
} satisfies ToolExample<
  SecondsPendulumLengthInput,
  SecondsPendulumLengthOutput
>;

export const tool = createSimpleTool({
  id: "horology/seconds-pendulum-length",
  title: "Seconds Pendulum Length",
  description:
    "Small-angle pendulum length for a two-second full period (one-second half swing) at local gravity.",
  inputs: [
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
    calculateSecondsPendulumLength({
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const secondsPendulumLengthTool = tool;
export const runSecondsPendulumLength = tool.execute;
export default tool;
