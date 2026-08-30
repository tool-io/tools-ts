import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HydroTurbinePowerInput = Readonly<{
  readonly densityKgPerM3: number;
  readonly gravityMetersPerSecondSquared: number;
  readonly flowCubicMetersPerSecond: number;
  readonly netHeadMeters: number;
  readonly efficiency: number;
}>;
export type HydroTurbinePowerOutput = Readonly<{
  readonly electricWatts: number;
}>;

export const calculateHydroTurbinePower = (
  x: HydroTurbinePowerInput,
): HydroTurbinePowerOutput => {
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
  if (!Number.isFinite(x.netHeadMeters) || x.netHeadMeters < 0)
    simpleError("netHeadMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.efficiency) || x.efficiency < 0)
    simpleError("efficiency", "Provide a finite number at least 0.");
  if (x.efficiency > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const electricWatts =
    x.densityKgPerM3 *
    x.gravityMetersPerSecondSquared *
    x.flowCubicMetersPerSecond *
    x.netHeadMeters *
    x.efficiency;
  if (!Number.isFinite(electricWatts))
    simpleError(
      "electricWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { electricWatts: Object.is(electricWatts, -0) ? 0 : electricWatts };
};

export const example = {
  input: {
    densityKgPerM3: 1000,
    gravityMetersPerSecondSquared: 9.81,
    flowCubicMetersPerSecond: 1,
    netHeadMeters: 10,
    efficiency: 0.9,
  },
  output: { electricWatts: 88290 },
} satisfies ToolExample<HydroTurbinePowerInput, HydroTurbinePowerOutput>;

export const tool = createSimpleTool({
  id: "engineering/hydro-turbine-power",
  title: "Hydro Turbine Power",
  description:
    "Hydroelectric output power ρgQHη from fluid density, flow, net head and total turbine-generator efficiency.",
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
      id: "netHeadMeters",
      kind: "number",
      label: "Net Head Meters",
      unit: "m",
      minimum: 0,
    },
    { id: "efficiency", kind: "number", label: "Efficiency", minimum: 0 },
  ],
  outputs: [
    { id: "electricWatts", kind: "number", label: "Electric Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculateHydroTurbinePower({
      densityKgPerM3: input.densityKgPerM3 as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
      flowCubicMetersPerSecond: input.flowCubicMetersPerSecond as number,
      netHeadMeters: input.netHeadMeters as number,
      efficiency: input.efficiency as number,
    }),
});
export const hydroTurbinePowerTool = tool;
export const runHydroTurbinePower = tool.execute;
export default tool;
