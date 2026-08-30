import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DynamicPressureFactorInput = Readonly<{
  readonly densityKgPerCubicMeter: number;
  readonly speedMetersPerSecond: number;
}>;
export type DynamicPressureFactorOutput = Readonly<{
  readonly dynamicPascals: number;
}>;

export const calculateDynamicPressureFactor = (
  x: DynamicPressureFactorInput,
): DynamicPressureFactorOutput => {
  if (
    !Number.isFinite(x.densityKgPerCubicMeter) ||
    x.densityKgPerCubicMeter <= 0
  )
    simpleError("densityKgPerCubicMeter", "Provide a finite positive number.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite nonnegative number.");
  const dynamicPascals =
    0.5 * x.densityKgPerCubicMeter * x.speedMetersPerSecond ** 2;
  if (!Number.isFinite(dynamicPascals))
    simpleError(
      "dynamicPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dynamicPascals: Object.is(dynamicPascals, -0) ? 0 : dynamicPascals };
};

export const example = {
  input: {
    densityKgPerCubicMeter: 1000,
    speedMetersPerSecond: 2,
  },
  output: { dynamicPascals: 2000 },
} satisfies ToolExample<
  DynamicPressureFactorInput,
  DynamicPressureFactorOutput
>;

export const tool = createSimpleTool({
  id: "horology/dynamic-pressure-factor",
  title: "Dynamic Pressure Factor",
  description:
    "Dynamic pressure ½ρv² in pascals for incompressible flow at specified density and speed.",
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
      id: "dynamicPascals",
      kind: "number",
      label: "Dynamic Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateDynamicPressureFactor({
      densityKgPerCubicMeter: input.densityKgPerCubicMeter as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
    }),
});
export const dynamicPressureFactorTool = tool;
export const runDynamicPressureFactor = tool.execute;
export default tool;
