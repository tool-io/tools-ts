import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepthStaticPressureInput = Readonly<{
  readonly depthMeters: number;
  readonly densityKgPerCubicMeter: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type DepthStaticPressureOutput = Readonly<{
  readonly gaugePascals: number;
}>;

export const calculateDepthStaticPressure = (
  x: DepthStaticPressureInput,
): DepthStaticPressureOutput => {
  if (!Number.isFinite(x.depthMeters) || x.depthMeters < 0)
    simpleError("depthMeters", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.densityKgPerCubicMeter) ||
    x.densityKgPerCubicMeter <= 0
  )
    simpleError("densityKgPerCubicMeter", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared <= 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite positive number.",
    );
  const gaugePascals =
    x.densityKgPerCubicMeter * x.gravityMetersPerSecondSquared * x.depthMeters;
  if (!Number.isFinite(gaugePascals))
    simpleError(
      "gaugePascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { gaugePascals: Object.is(gaugePascals, -0) ? 0 : gaugePascals };
};

export const example = {
  input: {
    depthMeters: 10,
    densityKgPerCubicMeter: 1000,
    gravityMetersPerSecondSquared: 9.80665,
  },
  output: { gaugePascals: 98066.5 },
} satisfies ToolExample<DepthStaticPressureInput, DepthStaticPressureOutput>;

export const tool = createSimpleTool({
  id: "horology/depth-static-pressure",
  title: "Depth Static Pressure",
  description:
    "Water gauge pressure in pascals from depth, fluid density and gravitational acceleration.",
  inputs: [
    {
      id: "depthMeters",
      kind: "number",
      label: "Depth Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "densityKgPerCubicMeter",
      kind: "number",
      label: "Density Kg Per Cubic Meter",
      unit: "kg/m3",
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
    { id: "gaugePascals", kind: "number", label: "Gauge Pascals", unit: "Pa" },
  ],
  calculate: (input) =>
    calculateDepthStaticPressure({
      depthMeters: input.depthMeters as number,
      densityKgPerCubicMeter: input.densityKgPerCubicMeter as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const depthStaticPressureTool = tool;
export const runDepthStaticPressure = tool.execute;
export default tool;
