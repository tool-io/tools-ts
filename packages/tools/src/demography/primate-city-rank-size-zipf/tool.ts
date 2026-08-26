import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PrimateCityRankSizeZipfInput = {
  readonly largestCityPopulation: number;
  readonly cityRank: number;
  readonly exponent?: number;
  readonly actualCityPopulation?: number;
};

export type PrimateCityRankSizeZipfOutput = {
  readonly predictedPopulation: number;
  readonly deviationPercent: number;
};

export const calculatePrimateCityRankSizeZipf = (
  input: PrimateCityRankSizeZipfInput,
): PrimateCityRankSizeZipfOutput => {
  if (!(input.largestCityPopulation > 0))
    return simpleError(
      "largestCityPopulation",
      "The primate city population must be greater than zero.",
      "invalid_population",
    );
  if (!Number.isSafeInteger(input.cityRank) || input.cityRank < 1)
    return simpleError(
      "cityRank",
      "The city rank must be a positive integer.",
      "invalid_rank",
    );
  const exponent = input.exponent ?? 1;
  if (!(exponent > 0))
    return simpleError(
      "exponent",
      "The rank-size exponent must be greater than zero.",
      "invalid_exponent",
    );
  if (
    input.actualCityPopulation !== undefined &&
    !(
      Number.isFinite(input.actualCityPopulation) &&
      input.actualCityPopulation >= 0
    )
  )
    return simpleError(
      "actualCityPopulation",
      "The observed city population must be finite and non-negative.",
      "invalid_population",
    );
  const predictedPopulation =
    input.largestCityPopulation / input.cityRank ** exponent;
  return {
    predictedPopulation,
    deviationPercent:
      input.actualCityPopulation === undefined
        ? 0
        : ((input.actualCityPopulation - predictedPopulation) /
            predictedPopulation) *
          100,
  };
};

export const primateCityRankSizeZipfExample = {
  input: {
    largestCityPopulation: 1200000,
    cityRank: 3,
    exponent: 1,
    actualCityPopulation: 520000,
  },
  output: { predictedPopulation: 400000, deviationPercent: 30 },
} satisfies ToolExample<
  PrimateCityRankSizeZipfInput,
  PrimateCityRankSizeZipfOutput
>;

export const primateCityRankSizeZipfTool = createSimpleTool({
  id: "demography/primate-city-rank-size-zipf",
  title: "Primate City Rank Size Zipf",
  description:
    "Apply the Zipf rank-size rule P(n) = P(1) / n^q to predict the population of the n-th largest city from the primate city, optionally reporting how far an observed city deviates from that prediction.",
  inputs: [
    {
      description: "Population of the largest (primate) city.",
      id: "largestCityPopulation",
      kind: "number",
      label: "P1",
      minimum: 0,
    },
    {
      description: "Rank of the city being evaluated.",
      id: "cityRank",
      kind: "integer",
      label: "Rank",
      minimum: 1,
    },
    {
      default: 1,
      description: "Rank-size exponent q; one is Zipf's law.",
      id: "exponent",
      kind: "number",
      label: "Exponent q",
    },
    {
      description: "Observed population of the ranked city, when known.",
      id: "actualCityPopulation",
      kind: "number",
      label: "Actual",
      minimum: 0,
      required: false,
    },
  ],
  outputs: [
    {
      description: "Predicted population of the ranked city under the rule.",
      id: "predictedPopulation",
      kind: "number",
      label: "Prediction",
    },
    {
      description:
        "Observed minus predicted as percent of prediction; zero when no observed value is supplied.",
      id: "deviationPercent",
      kind: "number",
      label: "Deviation %",
    },
  ],
  calculate: (input) =>
    calculatePrimateCityRankSizeZipf(
      input as unknown as PrimateCityRankSizeZipfInput,
    ),
});

export const runPrimateCityRankSizeZipf = primateCityRankSizeZipfTool.execute;
export default primateCityRankSizeZipfTool;
