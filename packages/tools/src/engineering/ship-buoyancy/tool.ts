import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShipBuoyancyInput = Readonly<{
  readonly fluidDensityKgPerM3: number;
  readonly gravityMetersPerSecondSquared: number;
  readonly displacedCubicMeters: number;
}>;
export type ShipBuoyancyOutput = Readonly<{
  readonly buoyantNewtons: number;
}>;

export const calculateShipBuoyancy = (
  x: ShipBuoyancyInput,
): ShipBuoyancyOutput => {
  if (!Number.isFinite(x.fluidDensityKgPerM3) || x.fluidDensityKgPerM3 < 0)
    simpleError("fluidDensityKgPerM3", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.displacedCubicMeters) || x.displacedCubicMeters < 0)
    simpleError("displacedCubicMeters", "Provide a finite number at least 0.");
  const buoyantNewtons =
    x.fluidDensityKgPerM3 *
    x.gravityMetersPerSecondSquared *
    x.displacedCubicMeters;
  if (!Number.isFinite(buoyantNewtons))
    simpleError(
      "buoyantNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { buoyantNewtons: Object.is(buoyantNewtons, -0) ? 0 : buoyantNewtons };
};

export const example = {
  input: {
    fluidDensityKgPerM3: 1025,
    gravityMetersPerSecondSquared: 9.81,
    displacedCubicMeters: 100,
  },
  output: { buoyantNewtons: 1005525 },
} satisfies ToolExample<ShipBuoyancyInput, ShipBuoyancyOutput>;

export const tool = createSimpleTool({
  id: "engineering/ship-buoyancy",
  title: "Ship Buoyancy",
  description:
    "Hydrostatic buoyant force equal to fluid density times gravity times displaced volume.",
  inputs: [
    {
      id: "fluidDensityKgPerM3",
      kind: "number",
      label: "Fluid Density Kg Per M3",
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
      id: "displacedCubicMeters",
      kind: "number",
      label: "Displaced Cubic Meters",
      unit: "m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "buoyantNewtons",
      kind: "number",
      label: "Buoyant Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateShipBuoyancy({
      fluidDensityKgPerM3: input.fluidDensityKgPerM3 as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
      displacedCubicMeters: input.displacedCubicMeters as number,
    }),
});
export const shipBuoyancyTool = tool;
export const runShipBuoyancy = tool.execute;
export default tool;
