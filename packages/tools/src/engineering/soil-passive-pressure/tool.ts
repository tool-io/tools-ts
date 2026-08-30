import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoilPassivePressureInput = Readonly<{
  readonly frictionAngleDegrees: number;
  readonly unitWeightNewtonsPerCubicMeter: number;
  readonly depthMeters: number;
}>;
export type SoilPassivePressureOutput = Readonly<{
  readonly pressurePascals: number;
}>;

export const calculateSoilPassivePressure = (
  x: SoilPassivePressureInput,
): SoilPassivePressureOutput => {
  if (!Number.isFinite(x.frictionAngleDegrees) || x.frictionAngleDegrees < 0)
    simpleError("frictionAngleDegrees", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.unitWeightNewtonsPerCubicMeter) ||
    x.unitWeightNewtonsPerCubicMeter < 0
  )
    simpleError(
      "unitWeightNewtonsPerCubicMeter",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.depthMeters) || x.depthMeters < 0)
    simpleError("depthMeters", "Provide a finite number at least 0.");
  if (x.frictionAngleDegrees >= 90)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pressurePascals =
    ((s) => (1 + s) / (1 - s))(
      Math.sin((x.frictionAngleDegrees * Math.PI) / 180),
    ) *
    x.unitWeightNewtonsPerCubicMeter *
    x.depthMeters;
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
  input: {
    frictionAngleDegrees: 30,
    unitWeightNewtonsPerCubicMeter: 18000,
    depthMeters: 2,
  },
  output: { pressurePascals: 108000 },
} satisfies ToolExample<SoilPassivePressureInput, SoilPassivePressureOutput>;

export const tool = createSimpleTool({
  id: "engineering/soil-passive-pressure",
  title: "Soil Passive Pressure",
  description:
    "Rankine passive lateral earth pressure at depth z for level cohesionless backfill: Kpγz, Kp=(1+sinφ)/(1−sinφ).",
  inputs: [
    {
      id: "frictionAngleDegrees",
      kind: "number",
      label: "Friction Angle Degrees",
      unit: "°",
      minimum: 0,
    },
    {
      id: "unitWeightNewtonsPerCubicMeter",
      kind: "number",
      label: "Unit Weight Newtons Per Cubic Meter",
      unit: "N/m³",
      minimum: 0,
    },
    {
      id: "depthMeters",
      kind: "number",
      label: "Depth Meters",
      unit: "m",
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
    calculateSoilPassivePressure({
      frictionAngleDegrees: input.frictionAngleDegrees as number,
      unitWeightNewtonsPerCubicMeter:
        input.unitWeightNewtonsPerCubicMeter as number,
      depthMeters: input.depthMeters as number,
    }),
});
export const soilPassivePressureTool = tool;
export const runSoilPassivePressure = tool.execute;
export default tool;
