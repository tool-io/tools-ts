import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterHammerPressureInput = Readonly<{
  readonly densityKgPerM3: number;
  readonly waveSpeedMetersPerSecond: number;
  readonly velocityChangeMetersPerSecond: number;
}>;
export type WaterHammerPressureOutput = Readonly<{
  readonly pressureRisePascals: number;
}>;

export const calculateWaterHammerPressure = (
  x: WaterHammerPressureInput,
): WaterHammerPressureOutput => {
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.waveSpeedMetersPerSecond) ||
    x.waveSpeedMetersPerSecond < 0
  )
    simpleError(
      "waveSpeedMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.velocityChangeMetersPerSecond) ||
    x.velocityChangeMetersPerSecond < 0
  )
    simpleError(
      "velocityChangeMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  const pressureRisePascals =
    x.densityKgPerM3 *
    x.waveSpeedMetersPerSecond *
    x.velocityChangeMetersPerSecond;
  if (!Number.isFinite(pressureRisePascals))
    simpleError(
      "pressureRisePascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pressureRisePascals: Object.is(pressureRisePascals, -0)
      ? 0
      : pressureRisePascals,
  };
};

export const example = {
  input: {
    densityKgPerM3: 1000,
    waveSpeedMetersPerSecond: 1200,
    velocityChangeMetersPerSecond: 1,
  },
  output: { pressureRisePascals: 1200000 },
} satisfies ToolExample<WaterHammerPressureInput, WaterHammerPressureOutput>;

export const tool = createSimpleTool({
  id: "engineering/water-hammer-pressure",
  title: "Water Hammer Pressure",
  description:
    "Joukowsky sudden-closure pressure rise Δp=ρaΔv using specified wave speed.",
  inputs: [
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "waveSpeedMetersPerSecond",
      kind: "number",
      label: "Wave Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "velocityChangeMetersPerSecond",
      kind: "number",
      label: "Velocity Change Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pressureRisePascals",
      kind: "number",
      label: "Pressure Rise Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateWaterHammerPressure({
      densityKgPerM3: input.densityKgPerM3 as number,
      waveSpeedMetersPerSecond: input.waveSpeedMetersPerSecond as number,
      velocityChangeMetersPerSecond:
        input.velocityChangeMetersPerSecond as number,
    }),
});
export const waterHammerPressureTool = tool;
export const runWaterHammerPressure = tool.execute;
export default tool;
