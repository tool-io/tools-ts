import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CriticalDepthRectangularInput = Readonly<{
  readonly flowPerWidthSquareMetersPerSecond: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type CriticalDepthRectangularOutput = Readonly<{
  readonly criticalDepthMeters: number;
}>;

export const calculateCriticalDepthRectangular = (
  x: CriticalDepthRectangularInput,
): CriticalDepthRectangularOutput => {
  if (
    !Number.isFinite(x.flowPerWidthSquareMetersPerSecond) ||
    x.flowPerWidthSquareMetersPerSecond < 0
  )
    simpleError(
      "flowPerWidthSquareMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  const criticalDepthMeters =
    (x.flowPerWidthSquareMetersPerSecond ** 2 /
      x.gravityMetersPerSecondSquared) **
    (1 / 3);
  if (!Number.isFinite(criticalDepthMeters))
    simpleError(
      "criticalDepthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    criticalDepthMeters: Object.is(criticalDepthMeters, -0)
      ? 0
      : criticalDepthMeters,
  };
};

export const example = {
  input: {
    flowPerWidthSquareMetersPerSecond: 2,
    gravityMetersPerSecondSquared: 9.81,
  },
  output: { criticalDepthMeters: 0.7415327354153678 },
} satisfies ToolExample<
  CriticalDepthRectangularInput,
  CriticalDepthRectangularOutput
>;

export const tool = createSimpleTool({
  id: "engineering/critical-depth-rectangular",
  title: "Critical Depth Rectangular",
  description:
    "Critical depth of rectangular open-channel flow from unit-width discharge q: yc=(q²/g)^(1/3).",
  inputs: [
    {
      id: "flowPerWidthSquareMetersPerSecond",
      kind: "number",
      label: "Flow Per Width Square Meters Per Second",
      unit: "m²/s",
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
      id: "criticalDepthMeters",
      kind: "number",
      label: "Critical Depth Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateCriticalDepthRectangular({
      flowPerWidthSquareMetersPerSecond:
        input.flowPerWidthSquareMetersPerSecond as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const criticalDepthRectangularTool = tool;
export const runCriticalDepthRectangular = tool.execute;
export default tool;
