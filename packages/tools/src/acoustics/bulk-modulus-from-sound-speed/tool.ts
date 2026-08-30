import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BulkModulusFromSoundSpeedInput = Readonly<{
  readonly densityKgPerCubicMeter: number;
  readonly speedMetersPerSecond: number;
}>;
export type BulkModulusFromSoundSpeedOutput = Readonly<{
  readonly bulkModulusPascals: number;
}>;

export const calculateBulkModulusFromSoundSpeed = (
  x: BulkModulusFromSoundSpeedInput,
): BulkModulusFromSoundSpeedOutput => {
  if (
    !Number.isFinite(x.densityKgPerCubicMeter) ||
    x.densityKgPerCubicMeter <= 0
  )
    simpleError("densityKgPerCubicMeter", "Provide a finite positive number.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  const bulkModulusPascals =
    x.densityKgPerCubicMeter * x.speedMetersPerSecond ** 2;
  if (!Number.isFinite(bulkModulusPascals))
    simpleError(
      "bulkModulusPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    bulkModulusPascals: Object.is(bulkModulusPascals, -0)
      ? 0
      : bulkModulusPascals,
  };
};

export const example = {
  input: {
    densityKgPerCubicMeter: 1000,
    speedMetersPerSecond: 1500,
  },
  output: { bulkModulusPascals: 2250000000 },
} satisfies ToolExample<
  BulkModulusFromSoundSpeedInput,
  BulkModulusFromSoundSpeedOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/bulk-modulus-from-sound-speed",
  title: "Bulk Modulus From Sound Speed",
  description:
    "Adiabatic bulk modulus rho*c² from medium density and sound speed.",
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
      id: "bulkModulusPascals",
      kind: "number",
      label: "Bulk Modulus Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateBulkModulusFromSoundSpeed({
      densityKgPerCubicMeter: input.densityKgPerCubicMeter as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
    }),
});
export const bulkModulusFromSoundSpeedTool = tool;
export const runBulkModulusFromSoundSpeed = tool.execute;
export default tool;
