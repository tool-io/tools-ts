import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarbonStockSingleTreeInput = Readonly<{
  readonly dryBiomassKilograms: number;
  readonly carbonFraction: number;
}>;
export type CarbonStockSingleTreeOutput = Readonly<{
  readonly carbonKilograms: number;
}>;

export const calculateCarbonStockSingleTree = (
  x: CarbonStockSingleTreeInput,
): CarbonStockSingleTreeOutput => {
  if (!Number.isFinite(x.dryBiomassKilograms) || x.dryBiomassKilograms < 0)
    simpleError("dryBiomassKilograms", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.carbonFraction) || x.carbonFraction < 0)
    simpleError("carbonFraction", "Provide a finite nonnegative number.");
  if (!(x.carbonFraction <= 1))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const carbonKilograms = x.dryBiomassKilograms * x.carbonFraction;
  if (!Number.isFinite(carbonKilograms))
    simpleError(
      "carbonKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    carbonKilograms: Object.is(carbonKilograms, -0) ? 0 : carbonKilograms,
  };
};

export const example = {
  input: {
    dryBiomassKilograms: 1000,
    carbonFraction: 0.5,
  },
  output: { carbonKilograms: 500 },
} satisfies ToolExample<
  CarbonStockSingleTreeInput,
  CarbonStockSingleTreeOutput
>;

export const tool = createSimpleTool({
  id: "forestry/carbon-stock-single-tree",
  title: "Carbon Stock Single Tree",
  description:
    "Tree carbon mass from dry biomass and user-supplied carbon mass fraction.",
  inputs: [
    {
      id: "dryBiomassKilograms",
      kind: "number",
      label: "Dry Biomass Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "carbonFraction",
      kind: "number",
      label: "Carbon Fraction",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "carbonKilograms",
      kind: "number",
      label: "Carbon Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateCarbonStockSingleTree({
      dryBiomassKilograms: input.dryBiomassKilograms as number,
      carbonFraction: input.carbonFraction as number,
    }),
});
export const carbonStockSingleTreeTool = tool;
export const runCarbonStockSingleTree = tool.execute;
export default tool;
