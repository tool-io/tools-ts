import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RankSizeZipfExponentCheckerInput = {
  readonly cityPopulation: number;
  readonly cityRank: number;
  readonly largestCityPopulation: number;
  readonly zipfExponent?: number;
};

export type RankSizeZipfExponentCheckerOutput = {
  readonly deviationPercent: number;
  readonly withinZipfTolerance: boolean;
};

export const rankSizeZipfExponentCheckerExample = {
  input: {
    cityPopulation: 480000,
    cityRank: 2,
    largestCityPopulation: 1000000,
    zipfExponent: 1,
  },
  output: {
    deviationPercent: -4,
    withinZipfTolerance: true,
  },
} satisfies ToolExample<
  RankSizeZipfExponentCheckerInput,
  RankSizeZipfExponentCheckerOutput
>;

const TOLERANCE_PERCENT = 10;

export const calculateRankSizeZipf = (
  input: RankSizeZipfExponentCheckerInput,
): RankSizeZipfExponentCheckerOutput => {
  if (!Number.isSafeInteger(input.cityRank) || input.cityRank <= 0)
    simpleError(
      "cityRank",
      "The rank must be a positive integer.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.cityPopulation) ||
    input.cityPopulation < 0 ||
    !Number.isFinite(input.largestCityPopulation) ||
    input.largestCityPopulation <= 0
  )
    simpleError(
      "largestCityPopulation",
      "City populations must be finite, and the largest-city population must be positive.",
      "invalid_value",
    );
  const exponent = input.zipfExponent ?? 1;
  if (!Number.isFinite(exponent) || exponent < 0)
    simpleError(
      "zipfExponent",
      "The Zipf exponent must be a finite nonnegative number.",
      "invalid_value",
    );
  const expected = input.largestCityPopulation / input.cityRank ** exponent;
  if (!Number.isFinite(expected) || expected <= 0)
    simpleError(
      "zipfExponent",
      "The expected city population is outside the finite positive numeric range.",
      "numeric_range",
    );
  const deviationPercent = ((input.cityPopulation - expected) / expected) * 100;
  if (!Number.isFinite(deviationPercent))
    simpleError(
      "cityPopulation",
      "The percentage deviation is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    deviationPercent,
    withinZipfTolerance: Math.abs(deviationPercent) <= TOLERANCE_PERCENT,
  };
};

export const rankSizeZipfExponentCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateRankSizeZipf({
      cityPopulation: input.cityPopulation as number,
      cityRank: input.cityRank as number,
      largestCityPopulation: input.largestCityPopulation as number,
      zipfExponent: input.zipfExponent as number,
    }),
  description:
    "Test a city against the Zipf rank-size rule and report how far its population deviates in percent.",
  id: "sociology/rank-size-zipf-exponent-checker",
  inputs: [
    {
      description: "Observed population of the ranked city.",
      id: "cityPopulation",
      kind: "number",
      label: "City population",
      minimum: 0,
    },
    {
      description: "Rank of the city within the urban system.",
      id: "cityRank",
      kind: "integer",
      label: "Rank",
      maximum: 1000000,
      minimum: 1,
    },
    {
      description: "Population of the largest city in the system.",
      id: "largestCityPopulation",
      kind: "number",
      label: "Largest city",
      minimum: Number.MIN_VALUE,
    },
    {
      default: 1,
      description: "Zipf exponent; one is the classical rank-size rule.",
      id: "zipfExponent",
      kind: "number",
      label: "Zipf exponent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Observed minus expected size relative to expected.",
      id: "deviationPercent",
      kind: "number",
      label: "Deviation",
      unit: "%",
    },
    {
      description: "Whether the absolute deviation stays inside ten percent.",
      id: "withinZipfTolerance",
      kind: "boolean",
      label: "Within tolerance",
    },
  ],
  title: "Zipf Rank-Size Exponent Checker",
});
export const runRankSizeZipfExponentChecker =
  rankSizeZipfExponentCheckerTool.execute;
export default rankSizeZipfExponentCheckerTool;
