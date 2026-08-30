import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeirFlowRectangularInput = Readonly<{
  readonly dischargeCoefficient: number;
  readonly widthMeters: number;
  readonly headMeters: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type WeirFlowRectangularOutput = Readonly<{
  readonly flowCubicMetersPerSecond: number;
}>;

export const calculateWeirFlowRectangular = (
  x: WeirFlowRectangularInput,
): WeirFlowRectangularOutput => {
  if (!Number.isFinite(x.dischargeCoefficient) || x.dischargeCoefficient < 0)
    simpleError("dischargeCoefficient", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.widthMeters) || x.widthMeters < 0)
    simpleError("widthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.headMeters) || x.headMeters < 0)
    simpleError("headMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  if (x.dischargeCoefficient > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const flowCubicMetersPerSecond =
    (2 / 3) *
    x.dischargeCoefficient *
    x.widthMeters *
    Math.sqrt(2 * x.gravityMetersPerSecondSquared) *
    x.headMeters ** 1.5;
  if (!Number.isFinite(flowCubicMetersPerSecond))
    simpleError(
      "flowCubicMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    flowCubicMetersPerSecond: Object.is(flowCubicMetersPerSecond, -0)
      ? 0
      : flowCubicMetersPerSecond,
  };
};

export const example = {
  input: {
    dischargeCoefficient: 0.6,
    widthMeters: 2,
    headMeters: 0.3,
    gravityMetersPerSecondSquared: 9.81,
  },
  output: { flowCubicMetersPerSecond: 0.5822659186316849 },
} satisfies ToolExample<WeirFlowRectangularInput, WeirFlowRectangularOutput>;

export const tool = createSimpleTool({
  id: "engineering/weir-flow-rectangular",
  title: "Weir Flow Rectangular",
  description:
    "Free-flow sharp-crested rectangular weir discharge with user-supplied coefficient: Q=(2/3)Cd b√(2g)h^(3/2); no end-contraction correction.",
  inputs: [
    {
      id: "dischargeCoefficient",
      kind: "number",
      label: "Discharge Coefficient",
      minimum: 0,
    },
    {
      id: "widthMeters",
      kind: "number",
      label: "Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "headMeters",
      kind: "number",
      label: "Head Meters",
      unit: "m",
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
      id: "flowCubicMetersPerSecond",
      kind: "number",
      label: "Flow Cubic Meters Per Second",
      unit: "m³/s",
    },
  ],
  calculate: (input) =>
    calculateWeirFlowRectangular({
      dischargeCoefficient: input.dischargeCoefficient as number,
      widthMeters: input.widthMeters as number,
      headMeters: input.headMeters as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const weirFlowRectangularTool = tool;
export const runWeirFlowRectangular = tool.execute;
export default tool;
