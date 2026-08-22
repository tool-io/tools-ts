import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelWeightInput = {
  readonly fuelGallons: number;
  readonly poundsPerGallon?: number;
};

export type FuelWeightOutput = {
  readonly weightLb: number;
};

/** Avgas weighs approximately 6 lb per US gallon. */
const AVGAS_LB_PER_GAL = 6;

export const fuelWeightExample = {
  input: { fuelGallons: 20 },
  output: { weightLb: 120 },
} satisfies ToolExample<FuelWeightInput, FuelWeightOutput>;

export const calculateFuelWeight = (
  input: FuelWeightInput,
): FuelWeightOutput => {
  if (input.fuelGallons < 0)
    simpleError(
      "fuelGallons",
      "The fuel volume cannot be negative.",
      "invalid_volume",
    );
  const ppg = input.poundsPerGallon ?? AVGAS_LB_PER_GAL;
  if (ppg <= 0)
    simpleError(
      "poundsPerGallon",
      "The fuel density must be positive.",
      "invalid_density",
    );
  return { weightLb: input.fuelGallons * ppg };
};

export const fuelWeightTool = createSimpleTool({
  calculate: (input) =>
    calculateFuelWeight(input as unknown as FuelWeightInput),
  description: "Compute the weight of a fuel load from its volume and density.",
  id: "aviation/fuel-weight",
  inputs: [
    {
      description: "Fuel quantity in US gallons.",
      id: "fuelGallons",
      kind: "number",
      label: "Fuel quantity",
      unit: "gal",
    },
    {
      default: 6,
      description:
        "Weight of one gallon of fuel; defaults to six pounds for avgas.",
      id: "poundsPerGallon",
      kind: "number",
      label: "Pounds per gallon",
      unit: "lb/gal",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total weight of the fuel load.",
      format: "weight-lb",
      id: "weightLb",
      kind: "number",
      label: "Fuel weight",
      unit: "lb",
    },
  ],
  title: "Fuel Weight Calculator",
});
export const runFuelWeight = fuelWeightTool.execute;
export default fuelWeightTool;
