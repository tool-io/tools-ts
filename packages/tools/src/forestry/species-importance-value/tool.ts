import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly speciesStemCounts: readonly number[];
  readonly speciesBasalAreasM2: readonly number[];
  readonly speciesOccupiedPlotCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly relativeDensityPercentages: readonly number[];
  readonly relativeDominancePercentages: readonly number[];
  readonly relativeFrequencyPercentages: readonly number[];
  readonly importanceValueScores: readonly number[];
}>;
const inputFields = [
  { id: "speciesStemCounts", label: "Species stem counts", kind: "numberList" },
  {
    id: "speciesBasalAreasM2",
    label: "Species basal areas m2",
    kind: "numberList",
  },
  {
    id: "speciesOccupiedPlotCounts",
    label: "Species occupied plot counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.speciesBasalAreasM2.forEach((v) =>
    nonnegative(v, "speciesBasalAreasM2"),
  );
  input.speciesStemCounts.forEach((v) => count(v, "speciesStemCounts"));
  input.speciesOccupiedPlotCounts.forEach((v) =>
    count(v, "speciesOccupiedPlotCounts"),
  );
  aligned(
    input.speciesStemCounts,
    input.speciesBasalAreasM2,
    "speciesStemCounts",
  );
  aligned(
    input.speciesStemCounts,
    input.speciesOccupiedPlotCounts,
    "speciesStemCounts",
  );
  const normalize = (x: readonly number[]) => {
      const s = positive(
        x.reduce((a, b) => a + b, 0),
        "speciesTotals",
      );
      return x.map((v) => (100 * v) / s);
    },
    relativeDensityPercentages = normalize(input.speciesStemCounts),
    relativeDominancePercentages = normalize(input.speciesBasalAreasM2),
    relativeFrequencyPercentages = normalize(input.speciesOccupiedPlotCounts);
  return {
    relativeDensityPercentages,
    relativeDominancePercentages,
    relativeFrequencyPercentages,
    importanceValueScores: relativeDensityPercentages.map(
      (v, i) =>
        v + relativeDominancePercentages[i] + relativeFrequencyPercentages[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  speciesStemCounts: [10, 30],
  speciesBasalAreasM2: [3, 1],
  speciesOccupiedPlotCounts: [2, 2],
} satisfies Input;
export const exampleOutput = {
  relativeDensityPercentages: [25, 75],
  relativeDominancePercentages: [75, 25],
  relativeFrequencyPercentages: [50, 50],
  importanceValueScores: [150, 150],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/species-importance-value",
  title: "Species Importance Value",
  description:
    "Calculate the three-component 0–300 importance-value convention from measured stems, basal area and plot occurrences; not percentage dominance alone or ecological importance certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "relativeDensityPercentages",
      label: "Relative density percentages",
      kind: "numberList",
    },
    {
      id: "relativeDominancePercentages",
      label: "Relative dominance percentages",
      kind: "numberList",
    },
    {
      id: "relativeFrequencyPercentages",
      label: "Relative frequency percentages",
      kind: "numberList",
    },
    {
      id: "importanceValueScores",
      label: "Importance value scores",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      speciesStemCounts: value.speciesStemCounts as readonly number[],
      speciesBasalAreasM2: value.speciesBasalAreasM2 as readonly number[],
      speciesOccupiedPlotCounts:
        value.speciesOccupiedPlotCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
