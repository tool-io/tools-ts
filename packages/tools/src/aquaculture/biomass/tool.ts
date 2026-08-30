import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiomassInput = Readonly<{
  readonly animalCount: number;
  readonly meanWeightGrams: number;
}>;
export type BiomassOutput = Readonly<{
  readonly biomassKilograms: number;
}>;

export const calculateBiomass = (x: BiomassInput): BiomassOutput => {
  if (
    !Number.isFinite(x.animalCount) ||
    x.animalCount < 0 ||
    !Number.isSafeInteger(x.animalCount)
  )
    simpleError("animalCount", "Provide a nonnegative whole number.");
  if (!Number.isFinite(x.meanWeightGrams) || x.meanWeightGrams < 0)
    simpleError("meanWeightGrams", "Provide a finite nonnegative number.");
  const biomassKilograms = (x.animalCount * x.meanWeightGrams) / 1000;
  if (!Number.isFinite(biomassKilograms))
    simpleError(
      "biomassKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    biomassKilograms: Object.is(biomassKilograms, -0) ? 0 : biomassKilograms,
  };
};

export const example = {
  input: {
    animalCount: 1000,
    meanWeightGrams: 500,
  },
  output: { biomassKilograms: 500 },
} satisfies ToolExample<BiomassInput, BiomassOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/biomass",
  title: "Biomass",
  description:
    "Estimate live biomass from animal count and sampled mean body mass.",
  inputs: [
    {
      id: "animalCount",
      kind: "number",
      label: "Animal Count",
      unit: "animals",
    },
    {
      id: "meanWeightGrams",
      kind: "number",
      label: "Mean Weight Grams",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "biomassKilograms",
      kind: "number",
      label: "Biomass Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateBiomass({
      animalCount: input.animalCount as number,
      meanWeightGrams: input.meanWeightGrams as number,
    }),
});
export const runBiomass = tool.execute;
export default tool;
