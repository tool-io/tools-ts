import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HorizontalCurveRadiusInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly gravityMetersPerSecondSquared: number;
  readonly superelevationRatio: number;
  readonly lateralFrictionFactor: number;
}>;
export type HorizontalCurveRadiusOutput = Readonly<{
  readonly radiusMeters: number;
}>;

export const calculateHorizontalCurveRadius = (
  x: HorizontalCurveRadiusInput,
): HorizontalCurveRadiusOutput => {
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
  if (!Number.isFinite(x.superelevationRatio) || x.superelevationRatio < 0)
    simpleError("superelevationRatio", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lateralFrictionFactor) || x.lateralFrictionFactor < 0)
    simpleError("lateralFrictionFactor", "Provide a finite number at least 0.");
  const radiusMeters =
    x.speedMetersPerSecond ** 2 /
    (x.gravityMetersPerSecondSquared *
      (x.superelevationRatio + x.lateralFrictionFactor));
  if (!Number.isFinite(radiusMeters))
    simpleError(
      "radiusMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { radiusMeters: Object.is(radiusMeters, -0) ? 0 : radiusMeters };
};

export const example = {
  input: {
    speedMetersPerSecond: 20,
    gravityMetersPerSecondSquared: 9.81,
    superelevationRatio: 0.05,
    lateralFrictionFactor: 0.1,
  },
  output: { radiusMeters: 271.8314644920149 },
} satisfies ToolExample<
  HorizontalCurveRadiusInput,
  HorizontalCurveRadiusOutput
>;

export const tool = createSimpleTool({
  id: "engineering/horizontal-curve-radius",
  title: "Horizontal Curve Radius",
  description:
    "Minimum ideal level-curve radius for specified speed and combined superelevation plus lateral friction: R=v²/[g(e+f)].",
  inputs: [
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
    {
      id: "superelevationRatio",
      kind: "number",
      label: "Superelevation Ratio",
      minimum: 0,
    },
    {
      id: "lateralFrictionFactor",
      kind: "number",
      label: "Lateral Friction Factor",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "radiusMeters", kind: "number", label: "Radius Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculateHorizontalCurveRadius({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
      superelevationRatio: input.superelevationRatio as number,
      lateralFrictionFactor: input.lateralFrictionFactor as number,
    }),
});
export const horizontalCurveRadiusTool = tool;
export const runHorizontalCurveRadius = tool.execute;
export default tool;
