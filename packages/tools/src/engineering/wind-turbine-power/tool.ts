import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindTurbinePowerInput = Readonly<{
  readonly airDensityKgPerM3: number;
  readonly sweptAreaSquareMeters: number;
  readonly windMetersPerSecond: number;
  readonly powerCoefficient: number;
  readonly drivetrainEfficiency: number;
}>;
export type WindTurbinePowerOutput = Readonly<{
  readonly electricWatts: number;
}>;

export const calculateWindTurbinePower = (
  x: WindTurbinePowerInput,
): WindTurbinePowerOutput => {
  if (!Number.isFinite(x.airDensityKgPerM3) || x.airDensityKgPerM3 < 0)
    simpleError("airDensityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sweptAreaSquareMeters) || x.sweptAreaSquareMeters < 0)
    simpleError("sweptAreaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.windMetersPerSecond) || x.windMetersPerSecond < 0)
    simpleError("windMetersPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.powerCoefficient) || x.powerCoefficient < 0)
    simpleError("powerCoefficient", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.drivetrainEfficiency) || x.drivetrainEfficiency < 0)
    simpleError("drivetrainEfficiency", "Provide a finite number at least 0.");
  if (x.powerCoefficient > 0.593 || x.drivetrainEfficiency > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const electricWatts =
    0.5 *
    x.airDensityKgPerM3 *
    x.sweptAreaSquareMeters *
    x.windMetersPerSecond ** 3 *
    x.powerCoefficient *
    x.drivetrainEfficiency;
  if (!Number.isFinite(electricWatts))
    simpleError(
      "electricWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { electricWatts: Object.is(electricWatts, -0) ? 0 : electricWatts };
};

export const example = {
  input: {
    airDensityKgPerM3: 1.225,
    sweptAreaSquareMeters: 100,
    windMetersPerSecond: 10,
    powerCoefficient: 0.4,
    drivetrainEfficiency: 0.9,
  },
  output: { electricWatts: 22050.000000000004 },
} satisfies ToolExample<WindTurbinePowerInput, WindTurbinePowerOutput>;

export const tool = createSimpleTool({
  id: "engineering/wind-turbine-power",
  title: "Wind Turbine Power",
  description:
    "Idealized electrical wind-turbine power ½ρAv³Cpη from air density, swept area, wind speed, power coefficient and drivetrain efficiency.",
  inputs: [
    {
      id: "airDensityKgPerM3",
      kind: "number",
      label: "Air Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "sweptAreaSquareMeters",
      kind: "number",
      label: "Swept Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "windMetersPerSecond",
      kind: "number",
      label: "Wind Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "powerCoefficient",
      kind: "number",
      label: "Power Coefficient",
      minimum: 0,
    },
    {
      id: "drivetrainEfficiency",
      kind: "number",
      label: "Drivetrain Efficiency",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "electricWatts", kind: "number", label: "Electric Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculateWindTurbinePower({
      airDensityKgPerM3: input.airDensityKgPerM3 as number,
      sweptAreaSquareMeters: input.sweptAreaSquareMeters as number,
      windMetersPerSecond: input.windMetersPerSecond as number,
      powerCoefficient: input.powerCoefficient as number,
      drivetrainEfficiency: input.drivetrainEfficiency as number,
    }),
});
export const windTurbinePowerTool = tool;
export const runWindTurbinePower = tool.execute;
export default tool;
