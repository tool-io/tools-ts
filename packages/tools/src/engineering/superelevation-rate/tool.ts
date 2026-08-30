import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SuperelevationRateInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly gravityMetersPerSecondSquared: number;
  readonly radiusMeters: number;
  readonly lateralFrictionFactor: number;
}>;
export type SuperelevationRateOutput = Readonly<{
  readonly superelevationRatio: number;
}>;

export const calculateSuperelevationRate = (
  x: SuperelevationRateInput,
): SuperelevationRateOutput => {
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
  if (!Number.isFinite(x.radiusMeters) || x.radiusMeters < 0)
    simpleError("radiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lateralFrictionFactor) || x.lateralFrictionFactor < 0)
    simpleError("lateralFrictionFactor", "Provide a finite number at least 0.");
  const superelevationRatio =
    x.speedMetersPerSecond ** 2 /
      (x.gravityMetersPerSecondSquared * x.radiusMeters) -
    x.lateralFrictionFactor;
  if (!Number.isFinite(superelevationRatio))
    simpleError(
      "superelevationRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    superelevationRatio: Object.is(superelevationRatio, -0)
      ? 0
      : superelevationRatio,
  };
};

export const example = {
  input: {
    speedMetersPerSecond: 20,
    gravityMetersPerSecondSquared: 9.81,
    radiusMeters: 200,
    lateralFrictionFactor: 0.1,
  },
  output: { superelevationRatio: 0.1038735983690112 },
} satisfies ToolExample<SuperelevationRateInput, SuperelevationRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/superelevation-rate",
  title: "Superelevation Rate",
  description:
    "Uncapped road-curve superelevation estimate e=v²/(gR)−f from speed, radius and assumed lateral friction; not a design-code limit.",
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
      id: "radiusMeters",
      kind: "number",
      label: "Radius Meters",
      unit: "m",
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
    {
      id: "superelevationRatio",
      kind: "number",
      label: "Superelevation Ratio",
    },
  ],
  calculate: (input) =>
    calculateSuperelevationRate({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
      radiusMeters: input.radiusMeters as number,
      lateralFrictionFactor: input.lateralFrictionFactor as number,
    }),
});
export const superelevationRateTool = tool;
export const runSuperelevationRate = tool.execute;
export default tool;
