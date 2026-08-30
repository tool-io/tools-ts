import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiomassExpansionFactorInput = Readonly<{
  readonly totalAbovegroundKilograms: number;
  readonly stemKilograms: number;
}>;
export type BiomassExpansionFactorOutput = Readonly<{
  readonly expansionFactor: number;
}>;

export const calculateBiomassExpansionFactor = (
  x: BiomassExpansionFactorInput,
): BiomassExpansionFactorOutput => {
  if (
    !Number.isFinite(x.totalAbovegroundKilograms) ||
    x.totalAbovegroundKilograms < 0
  )
    simpleError(
      "totalAbovegroundKilograms",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.stemKilograms) || x.stemKilograms <= 0)
    simpleError("stemKilograms", "Provide a finite positive number.");
  const expansionFactor = x.totalAbovegroundKilograms / x.stemKilograms;
  if (!Number.isFinite(expansionFactor))
    simpleError(
      "expansionFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    expansionFactor: Object.is(expansionFactor, -0) ? 0 : expansionFactor,
  };
};

export const example = {
  input: {
    totalAbovegroundKilograms: 1200,
    stemKilograms: 1000,
  },
  output: { expansionFactor: 1.2 },
} satisfies ToolExample<
  BiomassExpansionFactorInput,
  BiomassExpansionFactorOutput
>;

export const tool = createSimpleTool({
  id: "forestry/biomass-expansion-factor",
  title: "Biomass Expansion Factor",
  description:
    "Ratio of measured total aboveground dry biomass to inventoried stem dry biomass.",
  inputs: [
    {
      id: "totalAbovegroundKilograms",
      kind: "number",
      label: "Total Aboveground Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "stemKilograms",
      kind: "number",
      label: "Stem Kilograms",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "expansionFactor", kind: "number", label: "Expansion Factor" },
  ],
  calculate: (input) =>
    calculateBiomassExpansionFactor({
      totalAbovegroundKilograms: input.totalAbovegroundKilograms as number,
      stemKilograms: input.stemKilograms as number,
    }),
});
export const biomassExpansionFactorTool = tool;
export const runBiomassExpansionFactor = tool.execute;
export default tool;
