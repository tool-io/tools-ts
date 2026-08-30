import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShipDisplacementInput = Readonly<{
  readonly fluidDensityKgPerM3: number;
  readonly displacedCubicMeters: number;
}>;
export type ShipDisplacementOutput = Readonly<{
  readonly displacedKilograms: number;
}>;

export const calculateShipDisplacement = (
  x: ShipDisplacementInput,
): ShipDisplacementOutput => {
  if (!Number.isFinite(x.fluidDensityKgPerM3) || x.fluidDensityKgPerM3 < 0)
    simpleError("fluidDensityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.displacedCubicMeters) || x.displacedCubicMeters < 0)
    simpleError("displacedCubicMeters", "Provide a finite number at least 0.");
  const displacedKilograms = x.fluidDensityKgPerM3 * x.displacedCubicMeters;
  if (!Number.isFinite(displacedKilograms))
    simpleError(
      "displacedKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    displacedKilograms: Object.is(displacedKilograms, -0)
      ? 0
      : displacedKilograms,
  };
};

export const example = {
  input: { fluidDensityKgPerM3: 1025, displacedCubicMeters: 100 },
  output: { displacedKilograms: 102500 },
} satisfies ToolExample<ShipDisplacementInput, ShipDisplacementOutput>;

export const tool = createSimpleTool({
  id: "engineering/ship-displacement",
  title: "Ship Displacement",
  description:
    "Displaced fluid mass from fluid density times submerged volume; not vessel gross tonnage.",
  inputs: [
    {
      id: "fluidDensityKgPerM3",
      kind: "number",
      label: "Fluid Density Kg Per M3",
      unit: "kg/m³",
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
      id: "displacedKilograms",
      kind: "number",
      label: "Displaced Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateShipDisplacement({
      fluidDensityKgPerM3: input.fluidDensityKgPerM3 as number,
      displacedCubicMeters: input.displacedCubicMeters as number,
    }),
});
export const shipDisplacementTool = tool;
export const runShipDisplacement = tool.execute;
export default tool;
