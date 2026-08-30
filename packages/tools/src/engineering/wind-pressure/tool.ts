import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindPressureInput = Readonly<{
  readonly airDensityKgPerM3: number;
  readonly windSpeedMetersPerSecond: number;
}>;
export type WindPressureOutput = Readonly<{
  readonly pressurePascals: number;
}>;

export const calculateWindPressure = (
  x: WindPressureInput,
): WindPressureOutput => {
  if (!Number.isFinite(x.airDensityKgPerM3) || x.airDensityKgPerM3 < 0)
    simpleError("airDensityKgPerM3", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.windSpeedMetersPerSecond) ||
    x.windSpeedMetersPerSecond < 0
  )
    simpleError(
      "windSpeedMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  const pressurePascals =
    0.5 * x.airDensityKgPerM3 * x.windSpeedMetersPerSecond ** 2;
  if (!Number.isFinite(pressurePascals))
    simpleError(
      "pressurePascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pressurePascals: Object.is(pressurePascals, -0) ? 0 : pressurePascals,
  };
};

export const example = {
  input: { airDensityKgPerM3: 1.225, windSpeedMetersPerSecond: 20 },
  output: { pressurePascals: 245.00000000000003 },
} satisfies ToolExample<WindPressureInput, WindPressureOutput>;

export const tool = createSimpleTool({
  id: "engineering/wind-pressure",
  title: "Wind Pressure",
  description:
    "Unfactored dynamic wind pressure q=½ρv² from supplied air density and wind speed; not a code design load.",
  inputs: [
    {
      id: "airDensityKgPerM3",
      kind: "number",
      label: "Air Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "windSpeedMetersPerSecond",
      kind: "number",
      label: "Wind Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pressurePascals",
      kind: "number",
      label: "Pressure Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateWindPressure({
      airDensityKgPerM3: input.airDensityKgPerM3 as number,
      windSpeedMetersPerSecond: input.windSpeedMetersPerSecond as number,
    }),
});
export const windPressureTool = tool;
export const runWindPressure = tool.execute;
export default tool;
