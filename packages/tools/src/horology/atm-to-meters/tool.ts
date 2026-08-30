import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AtmToMetersInput = Readonly<{
  readonly gaugeAtmospheres: number;
  readonly densityKgPerCubicMeter: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type AtmToMetersOutput = Readonly<{
  readonly hydrostaticMeters: number;
}>;

export const calculateAtmToMeters = (
  x: AtmToMetersInput,
): AtmToMetersOutput => {
  if (!Number.isFinite(x.gaugeAtmospheres) || x.gaugeAtmospheres < 0)
    simpleError("gaugeAtmospheres", "Provide a finite nonnegative number.");
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
  const hydrostaticMeters =
    (x.gaugeAtmospheres * 101325) /
    (x.densityKgPerCubicMeter * x.gravityMetersPerSecondSquared);
  if (!Number.isFinite(hydrostaticMeters))
    simpleError(
      "hydrostaticMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    hydrostaticMeters: Object.is(hydrostaticMeters, -0) ? 0 : hydrostaticMeters,
  };
};

export const example = {
  input: {
    gaugeAtmospheres: 1,
    densityKgPerCubicMeter: 1000,
    gravityMetersPerSecondSquared: 9.80665,
  },
  output: { hydrostaticMeters: 10.332274527998859 },
} satisfies ToolExample<AtmToMetersInput, AtmToMetersOutput>;

export const tool = createSimpleTool({
  id: "horology/atm-to-meters",
  title: "Atm To Meters",
  description:
    "Freshwater hydrostatic depth equivalent of a gauge-pressure rating in standard atmospheres; not a safe diving depth.",
  inputs: [
    {
      id: "gaugeAtmospheres",
      kind: "number",
      label: "Gauge Atmospheres",
      unit: "atm",
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
      id: "hydrostaticMeters",
      kind: "number",
      label: "Hydrostatic Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateAtmToMeters({
      gaugeAtmospheres: input.gaugeAtmospheres as number,
      densityKgPerCubicMeter: input.densityKgPerCubicMeter as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const atmToMetersTool = tool;
export const runAtmToMeters = tool.execute;
export default tool;
