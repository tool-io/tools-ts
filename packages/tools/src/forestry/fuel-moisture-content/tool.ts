import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelMoistureContentInput = Readonly<{
  readonly wetGrams: number;
  readonly dryGrams: number;
}>;
export type FuelMoistureContentOutput = Readonly<{
  readonly dryBasisMoisturePercent: number;
}>;

export const calculateFuelMoistureContent = (
  x: FuelMoistureContentInput,
): FuelMoistureContentOutput => {
  if (!Number.isFinite(x.wetGrams) || x.wetGrams <= 0)
    simpleError("wetGrams", "Provide a finite positive number.");
  if (!Number.isFinite(x.dryGrams) || x.dryGrams <= 0)
    simpleError("dryGrams", "Provide a finite positive number.");
  if (!(x.wetGrams >= x.dryGrams))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const dryBasisMoisturePercent =
    (100 * (x.wetGrams - x.dryGrams)) / x.dryGrams;
  if (!Number.isFinite(dryBasisMoisturePercent))
    simpleError(
      "dryBasisMoisturePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dryBasisMoisturePercent: Object.is(dryBasisMoisturePercent, -0)
      ? 0
      : dryBasisMoisturePercent,
  };
};

export const example = {
  input: {
    wetGrams: 110,
    dryGrams: 100,
  },
  output: { dryBasisMoisturePercent: 10 },
} satisfies ToolExample<FuelMoistureContentInput, FuelMoistureContentOutput>;

export const tool = createSimpleTool({
  id: "forestry/fuel-moisture-content",
  title: "Fuel Moisture Content",
  description:
    "Dry-basis fuel moisture percentage from wet and oven-dry sample masses.",
  inputs: [
    {
      id: "wetGrams",
      kind: "number",
      label: "Wet Grams",
      unit: "g",
      minimum: 0,
    },
    {
      id: "dryGrams",
      kind: "number",
      label: "Dry Grams",
      unit: "g",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dryBasisMoisturePercent",
      kind: "number",
      label: "Dry Basis Moisture Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateFuelMoistureContent({
      wetGrams: input.wetGrams as number,
      dryGrams: input.dryGrams as number,
    }),
});
export const fuelMoistureContentTool = tool;
export const runFuelMoistureContent = tool.execute;
export default tool;
