import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AcousticImpedanceMediumInput = Readonly<{
  readonly densityKgPerCubicMeter: number;
  readonly speedMetersPerSecond: number;
}>;
export type AcousticImpedanceMediumOutput = Readonly<{
  readonly impedanceRayls: number;
}>;

export const calculateAcousticImpedanceMedium = (
  x: AcousticImpedanceMediumInput,
): AcousticImpedanceMediumOutput => {
  if (
    !Number.isFinite(x.densityKgPerCubicMeter) ||
    x.densityKgPerCubicMeter <= 0
  )
    simpleError("densityKgPerCubicMeter", "Provide a finite positive number.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  const impedanceRayls = x.densityKgPerCubicMeter * x.speedMetersPerSecond;
  if (!Number.isFinite(impedanceRayls))
    simpleError(
      "impedanceRayls",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { impedanceRayls: Object.is(impedanceRayls, -0) ? 0 : impedanceRayls };
};

export const example = {
  input: {
    densityKgPerCubicMeter: 1.2,
    speedMetersPerSecond: 343,
  },
  output: { impedanceRayls: 411.59999999999997 },
} satisfies ToolExample<
  AcousticImpedanceMediumInput,
  AcousticImpedanceMediumOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/acoustic-impedance-medium",
  title: "Acoustic Impedance Medium",
  description:
    "Characteristic specific acoustic impedance rho*c for a uniform medium.",
  inputs: [
    {
      id: "densityKgPerCubicMeter",
      kind: "number",
      label: "Density Kg Per Cubic Meter",
      unit: "kg/m3",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "impedanceRayls",
      kind: "number",
      label: "Impedance Rayls",
      unit: "rayl",
    },
  ],
  calculate: (input) =>
    calculateAcousticImpedanceMedium({
      densityKgPerCubicMeter: input.densityKgPerCubicMeter as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
    }),
});
export const acousticImpedanceMediumTool = tool;
export const runAcousticImpedanceMedium = tool.execute;
export default tool;
