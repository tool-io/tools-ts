import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CityPrimacyFourCityIndexInput = {
  readonly secondCityPopulation: number;
  readonly thirdCityPopulation: number;
  readonly fourthCityPopulation: number;
  readonly largestCityPopulation: number;
};

export type CityPrimacyFourCityIndexOutput = {
  readonly fourCityPrimacyIndex: number;
};

export const cityPrimacyFourCityIndexExample = {
  input: {
    fourthCityPopulation: 200000,
    largestCityPopulation: 1000000,
    secondCityPopulation: 500000,
    thirdCityPopulation: 300000,
  },
  output: {
    fourCityPrimacyIndex: 1,
  },
} satisfies ToolExample<
  CityPrimacyFourCityIndexInput,
  CityPrimacyFourCityIndexOutput
>;

export const calculateFourCityPrimacy = (
  input: CityPrimacyFourCityIndexInput,
): CityPrimacyFourCityIndexOutput => {
  const rankedPopulations = [
    input.largestCityPopulation,
    input.secondCityPopulation,
    input.thirdCityPopulation,
    input.fourthCityPopulation,
  ];
  if (
    rankedPopulations.some(
      (population) => !Number.isFinite(population) || population < 0,
    )
  )
    simpleError(
      "largestCityPopulation",
      "Every city population must be a finite nonnegative number.",
      "invalid_value",
    );
  for (let index = 1; index < rankedPopulations.length; index += 1)
    if (rankedPopulations[index] > rankedPopulations[index - 1])
      simpleError(
        index === 1
          ? "secondCityPopulation"
          : index === 2
            ? "thirdCityPopulation"
            : "fourthCityPopulation",
        "City populations must be supplied in descending rank order.",
        "invalid_rank_order",
      );
  const denominator =
    input.secondCityPopulation +
    input.thirdCityPopulation +
    input.fourthCityPopulation;
  if (denominator <= 0)
    simpleError(
      "secondCityPopulation",
      "The next three cities must hold a positive population.",
      "invalid_value",
    );
  const fourCityPrimacyIndex = input.largestCityPopulation / denominator;
  if (!Number.isFinite(fourCityPrimacyIndex))
    simpleError(
      "largestCityPopulation",
      "The primacy index is outside the finite numeric range.",
      "numeric_range",
    );
  return { fourCityPrimacyIndex };
};

export const cityPrimacyFourCityIndexTool = createSimpleTool({
  calculate: (input) =>
    calculateFourCityPrimacy({
      fourthCityPopulation: input.fourthCityPopulation as number,
      largestCityPopulation: input.largestCityPopulation as number,
      secondCityPopulation: input.secondCityPopulation as number,
      thirdCityPopulation: input.thirdCityPopulation as number,
    }),
  description:
    "Score urban primacy as the largest city's population over the combined next three cities.",
  id: "sociology/city-primacy-four-city-index",
  inputs: [
    {
      description: "Largest city population.",
      id: "largestCityPopulation",
      kind: "number",
      label: "First city",
      minimum: 0,
    },
    {
      description: "Second city population.",
      id: "secondCityPopulation",
      kind: "number",
      label: "Second city",
      minimum: 0,
    },
    {
      description: "Third city population.",
      id: "thirdCityPopulation",
      kind: "number",
      label: "Third city",
      minimum: 0,
    },
    {
      description: "Fourth city population.",
      id: "fourthCityPopulation",
      kind: "number",
      label: "Fourth city",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Primacy ratio; values near or above one mark a primate city system.",
      id: "fourCityPrimacyIndex",
      kind: "number",
      label: "Four-city primacy",
    },
  ],
  title: "Four-City Primacy Index Calculator",
});
export const runCityPrimacyFourCityIndex = cityPrimacyFourCityIndexTool.execute;
export default cityPrimacyFourCityIndexTool;
