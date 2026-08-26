import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OldAgeProportion65PlusInput = {
  readonly population65Plus: number;
  readonly totalPopulation: number;
};

export type OldAgeProportion65PlusOutput = {
  readonly oldAgeProportionPercent: number;
};

export const calculateOldAgeProportion65Plus = (
  input: OldAgeProportion65PlusInput,
): OldAgeProportion65PlusOutput => {
  if (!(input.population65Plus >= 0))
    return simpleError(
      "population65Plus",
      "Population aged 65+ must be non-negative.",
      "invalid_population",
    );
  if (!(input.totalPopulation > 0))
    return simpleError(
      "totalPopulation",
      "Total population must be greater than zero.",
      "invalid_population",
    );
  if (input.population65Plus > input.totalPopulation)
    return simpleError(
      "population65Plus",
      "The 65+ population cannot exceed the total population.",
      "invalid_population",
    );
  return {
    oldAgeProportionPercent:
      (100 * input.population65Plus) / input.totalPopulation,
  };
};

export const oldAgeProportion65PlusExample = {
  input: { population65Plus: 1750, totalPopulation: 10000 },
  output: { oldAgeProportionPercent: 17.5 },
} satisfies ToolExample<
  OldAgeProportion65PlusInput,
  OldAgeProportion65PlusOutput
>;

export const oldAgeProportion65PlusTool = createSimpleTool({
  id: "demography/old-age-proportion-65-plus",
  title: "Old-Age Proportion Calculator",
  description:
    "Compute the proportion of a population aged 65 years and over, expressed as a percentage.",
  inputs: [
    {
      description: "Population aged 65 years and over.",
      id: "population65Plus",
      kind: "number",
      label: "Pop 65+",
      minimum: 0,
    },
    {
      description: "Total population of all ages.",
      id: "totalPopulation",
      kind: "number",
      label: "Total pop",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Share of the population aged 65+, in percent.",
      id: "oldAgeProportionPercent",
      kind: "number",
      label: "65+ share",
    },
  ],
  calculate: (input) =>
    calculateOldAgeProportion65Plus(
      input as unknown as OldAgeProportion65PlusInput,
    ),
});

export const runOldAgeProportion65Plus = oldAgeProportion65PlusTool.execute;
export default oldAgeProportion65PlusTool;
