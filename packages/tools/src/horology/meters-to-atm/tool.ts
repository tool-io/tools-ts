import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MetersToAtmInput = Readonly<{
  readonly depthMeters: number;
  readonly densityKgPerCubicMeter: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type MetersToAtmOutput = Readonly<{
  readonly gaugeAtmospheres: number;
}>;

export const calculateMetersToAtm = (
  x: MetersToAtmInput,
): MetersToAtmOutput => {
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
  const gaugeAtmospheres =
    (x.densityKgPerCubicMeter *
      x.gravityMetersPerSecondSquared *
      x.depthMeters) /
    101325;
  if (!Number.isFinite(gaugeAtmospheres))
    simpleError(
      "gaugeAtmospheres",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    gaugeAtmospheres: Object.is(gaugeAtmospheres, -0) ? 0 : gaugeAtmospheres,
  };
};

export const example = {
  input: {
    depthMeters: 10,
    densityKgPerCubicMeter: 1000,
    gravityMetersPerSecondSquared: 9.80665,
  },
  output: { gaugeAtmospheres: 0.9678411053540588 },
} satisfies ToolExample<MetersToAtmInput, MetersToAtmOutput>;

export const tool = createSimpleTool({
  id: "horology/meters-to-atm",
  title: "Meters To Atm",
  description:
    "Gauge pressure in standard atmospheres from freshwater depth, density and gravity; not a watch depth rating.",
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
    {
      id: "gaugeAtmospheres",
      kind: "number",
      label: "Gauge Atmospheres",
      unit: "atm",
    },
  ],
  calculate: (input) =>
    calculateMetersToAtm({
      depthMeters: input.depthMeters as number,
      densityKgPerCubicMeter: input.densityKgPerCubicMeter as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const metersToAtmTool = tool;
export const runMetersToAtm = tool.execute;
export default tool;
