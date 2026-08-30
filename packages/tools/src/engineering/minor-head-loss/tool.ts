import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MinorHeadLossInput = Readonly<{
  readonly lossCoefficient: number;
  readonly speedMetersPerSecond: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type MinorHeadLossOutput = Readonly<{
  readonly headLossMeters: number;
}>;

export const calculateMinorHeadLoss = (
  x: MinorHeadLossInput,
): MinorHeadLossOutput => {
  if (!Number.isFinite(x.lossCoefficient) || x.lossCoefficient < 0)
    simpleError("lossCoefficient", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  const headLossMeters =
    (x.lossCoefficient * x.speedMetersPerSecond ** 2) /
    (2 * x.gravityMetersPerSecondSquared);
  if (!Number.isFinite(headLossMeters))
    simpleError(
      "headLossMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { headLossMeters: Object.is(headLossMeters, -0) ? 0 : headLossMeters };
};

export const example = {
  input: {
    lossCoefficient: 1.5,
    speedMetersPerSecond: 2,
    gravityMetersPerSecondSquared: 9.81,
  },
  output: { headLossMeters: 0.3058103975535168 },
} satisfies ToolExample<MinorHeadLossInput, MinorHeadLossOutput>;

export const tool = createSimpleTool({
  id: "engineering/minor-head-loss",
  title: "Minor Head Loss",
  description:
    "Local fluid head loss K v²/(2g) using a supplied dimensionless loss coefficient.",
  inputs: [
    {
      id: "lossCoefficient",
      kind: "number",
      label: "Loss Coefficient",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "gravityMetersPerSecondSquared",
      kind: "number",
      label: "Gravity Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "headLossMeters",
      kind: "number",
      label: "Head Loss Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateMinorHeadLoss({
      lossCoefficient: input.lossCoefficient as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const minorHeadLossTool = tool;
export const runMinorHeadLoss = tool.execute;
export default tool;
