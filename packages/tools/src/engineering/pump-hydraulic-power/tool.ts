import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PumpHydraulicPowerInput = Readonly<{
  readonly densityKgPerM3: number;
  readonly gravityMetersPerSecondSquared: number;
  readonly flowCubicMetersPerSecond: number;
  readonly headMeters: number;
}>;
export type PumpHydraulicPowerOutput = Readonly<{
  readonly powerWatts: number;
}>;

export const calculatePumpHydraulicPower = (
  x: PumpHydraulicPowerInput,
): PumpHydraulicPowerOutput => {
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.flowCubicMetersPerSecond) ||
    x.flowCubicMetersPerSecond < 0
  )
    simpleError(
      "flowCubicMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.headMeters) || x.headMeters < 0)
    simpleError("headMeters", "Provide a finite number at least 0.");
  const powerWatts =
    x.densityKgPerM3 *
    x.gravityMetersPerSecondSquared *
    x.flowCubicMetersPerSecond *
    x.headMeters;
  if (!Number.isFinite(powerWatts))
    simpleError(
      "powerWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { powerWatts: Object.is(powerWatts, -0) ? 0 : powerWatts };
};

export const example = {
  input: {
    densityKgPerM3: 1000,
    gravityMetersPerSecondSquared: 9.81,
    flowCubicMetersPerSecond: 0.01,
    headMeters: 10,
  },
  output: { powerWatts: 981.0000000000001 },
} satisfies ToolExample<PumpHydraulicPowerInput, PumpHydraulicPowerOutput>;

export const tool = createSimpleTool({
  id: "engineering/pump-hydraulic-power",
  title: "Pump Hydraulic Power",
  description:
    "Hydraulic output power ρgQH delivered by a pump, excluding shaft and motor losses.",
  inputs: [
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "gravityMetersPerSecondSquared",
      kind: "number",
      label: "Gravity Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
    {
      id: "flowCubicMetersPerSecond",
      kind: "number",
      label: "Flow Cubic Meters Per Second",
      unit: "m³/s",
      minimum: 0,
    },
    {
      id: "headMeters",
      kind: "number",
      label: "Head Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "powerWatts", kind: "number", label: "Power Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculatePumpHydraulicPower({
      densityKgPerM3: input.densityKgPerM3 as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
      flowCubicMetersPerSecond: input.flowCubicMetersPerSecond as number,
      headMeters: input.headMeters as number,
    }),
});
export const pumpHydraulicPowerTool = tool;
export const runPumpHydraulicPower = tool.execute;
export default tool;
