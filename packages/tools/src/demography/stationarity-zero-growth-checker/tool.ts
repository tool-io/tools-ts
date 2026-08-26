import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StationarityZeroGrowthCheckerInput = {
  readonly source?: "rate" | "counts";
  readonly growthRateR?: number;
  readonly populationStart?: number;
  readonly populationEnd?: number;
  readonly years?: number;
  readonly tolerance?: number;
};

export type StationarityZeroGrowthCheckerOutput = {
  readonly annualGrowthRate: number;
  readonly status: "growing" | "stationary" | "shrinking";
};

export const calculateStationarityZeroGrowthChecker = (
  input: StationarityZeroGrowthCheckerInput,
): StationarityZeroGrowthCheckerOutput => {
  const tolerance = input.tolerance ?? 1e-6;
  if (!(Number.isFinite(tolerance) && tolerance >= 0))
    simpleError(
      "tolerance",
      "The tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const annualGrowthRate =
    input.source === "counts"
      ? (() => {
          const start = input.populationStart ?? 0;
          const end = input.populationEnd ?? 0;
          const years = input.years ?? 1;
          if (!(start > 0 && end > 0))
            simpleError(
              "populationStart",
              "Both populations must be greater than zero.",
              "invalid_population",
            );
          if (!(years > 0))
            simpleError(
              "years",
              "The elapsed time must be greater than zero.",
              "invalid_interval",
            );
          return Math.log(end / start) / years;
        })()
      : (() => {
          const rate = input.growthRateR ?? 0;
          if (!Number.isFinite(rate))
            simpleError(
              "growthRateR",
              "The annual growth rate must be finite.",
              "invalid_rate",
            );
          return rate;
        })();
  const status =
    Math.abs(annualGrowthRate) <= tolerance
      ? "stationary"
      : annualGrowthRate > 0
        ? "growing"
        : "shrinking";
  return { annualGrowthRate, status };
};

export const stationarityZeroGrowthCheckerExample = {
  input: {
    source: "counts",
    populationStart: 1000000,
    populationEnd: 1200000,
    years: 10,
    tolerance: 1e-6,
  },
  output: { annualGrowthRate: 0.01823215567939546, status: "growing" },
} satisfies ToolExample<
  StationarityZeroGrowthCheckerInput,
  StationarityZeroGrowthCheckerOutput
>;

export const stationarityZeroGrowthCheckerTool = createSimpleTool({
  id: "demography/stationarity-zero-growth-checker",
  title: "Stationarity Zero Growth Checker",
  description:
    "Classify zero population growth from an annual growth rate or a two-census count pair, treating |r| within the stated tolerance as stationary, above it as growing and below negative it as shrinking.",
  inputs: [
    {
      default: "rate",
      description:
        "Supply an explicit rate, or derive ln(P2/P1)/t from census counts.",
      enum: ["rate", "counts"],
      id: "source",
      kind: "string",
      label: "Source",
    },
    {
      default: 0,
      description: "Annual growth rate r when the source is 'rate'.",
      id: "growthRateR",
      kind: "number",
      label: "Growth rate r",
    },
    {
      default: 0,
      description: "Population at the first census P1 (counts source).",
      id: "populationStart",
      kind: "number",
      label: "P1",
      minimum: 0,
    },
    {
      default: 0,
      description: "Population at the second census P2 (counts source).",
      id: "populationEnd",
      kind: "number",
      label: "P2",
      minimum: 0,
    },
    {
      default: 1,
      description: "Years between the censuses t (counts source).",
      id: "years",
      kind: "number",
      label: "Years",
      minimum: 0,
    },
    {
      default: 1e-6,
      description: "Absolute |r| band treated as zero growth.",
      id: "tolerance",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Annual growth rate used for the classification.",
      id: "annualGrowthRate",
      kind: "number",
      label: "r",
    },
    {
      description: "Zero-growth classification within tolerance.",
      enum: ["growing", "stationary", "shrinking"],
      id: "status",
      kind: "string",
      label: "Status",
    },
  ],
  calculate: (input) =>
    calculateStationarityZeroGrowthChecker(
      input as unknown as StationarityZeroGrowthCheckerInput,
    ),
});

export const runStationarityZeroGrowthChecker =
  stationarityZeroGrowthCheckerTool.execute;
export default stationarityZeroGrowthCheckerTool;
