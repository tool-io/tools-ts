import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LotkaIntrinsicGrowthRateRInput = {
  readonly asfr: readonly number[];
  readonly personYearsLx: readonly number[];
  readonly startingAge?: number;
  readonly classWidth?: number;
};

export type LotkaIntrinsicGrowthRateROutput = {
  readonly intrinsicGrowthRate: number;
  readonly netReproductionRate: number;
};

/**
 * Euler-Lotka equation sum w_k exp(-r a_k) = 1 solved by bisection;
 * g(r) is strictly decreasing when any net maternity weight is positive.
 */
const solveLotka = (
  weights: readonly number[],
  ages: readonly number[],
): number => {
  const g = (r: number): number => {
    let total = 0;
    for (let index = 0; index < weights.length; index += 1)
      if (weights[index] !== 0)
        total += weights[index]! * Math.exp(-r * ages[index]!);
    return total - 1;
  };
  let lo = -0.5;
  let hi = 0.5;
  while (g(lo) <= 0 && lo > -64) lo *= 2;
  while (g(hi) >= 0 && hi < 64) hi *= 2;
  if (!(g(lo) > 0) || !(g(hi) < 0))
    simpleError(
      "asfr",
      "The fertility schedule must imply a finite intrinsic growth rate.",
      "invalid_schedule",
    );
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const mid = (lo + hi) / 2;
    if (g(mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

export const calculateLotkaIntrinsicGrowthRateR = (
  input: LotkaIntrinsicGrowthRateRInput,
): LotkaIntrinsicGrowthRateROutput => {
  const asfr = input.asfr;
  const personYearsLx = input.personYearsLx;
  const startingAge = input.startingAge ?? 15;
  const classWidth = input.classWidth ?? 5;
  if (!(classWidth > 0))
    simpleError(
      "classWidth",
      "The age-class width must be greater than zero.",
      "invalid_interval",
    );
  if (asfr.length === 0)
    simpleError(
      "asfr",
      "Provide at least one age-specific fertility rate.",
      "invalid_list",
    );
  if (asfr.length !== personYearsLx.length)
    simpleError(
      "personYearsLx",
      "The life-table person-years list must align with the rates.",
      "invalid_list",
    );
  for (const value of asfr)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "asfr",
        "Fertility rates must be finite and non-negative.",
        "invalid_list",
      );
  for (const value of personYearsLx)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "personYearsLx",
        "Person-years values must be finite and non-negative.",
        "invalid_list",
      );
  const weights = asfr.map((rate, index) => rate * personYearsLx[index]!);
  const ages = asfr.map((_, index) => startingAge + classWidth * (index + 0.5));
  let netReproductionRate = 0;
  for (const weight of weights) netReproductionRate += weight;
  if (!(netReproductionRate > 0))
    simpleError(
      "asfr",
      "At least one net maternity value must be positive.",
      "invalid_schedule",
    );
  return {
    intrinsicGrowthRate: solveLotka(weights, ages),
    netReproductionRate,
  };
};

export const lotkaIntrinsicGrowthRateRExample = {
  input: {
    asfr: [0, 0.1, 0.15, 0.05, 0],
    personYearsLx: [4.9, 4.85, 4.8, 4.75, 4.7],
    startingAge: 15,
    classWidth: 5,
  },
  output: {
    intrinsicGrowthRate: 0.013793747142994896,
    netReproductionRate: 1.4425000000000001,
  },
} satisfies ToolExample<
  LotkaIntrinsicGrowthRateRInput,
  LotkaIntrinsicGrowthRateROutput
>;

export const lotkaIntrinsicGrowthRateRTool = createSimpleTool({
  id: "demography/lotka-intrinsic-growth-rate-r",
  title: "Lotka Intrinsic Growth Rate R Calculator",
  description:
    "Solve the Euler-Lotka equation for the intrinsic growth rate r from an age-specific female fertility schedule and female life-table person-years, using midpoint ages of equal-width classes.",
  inputs: [
    {
      description:
        "Female age-specific fertility rates per woman per year for each class.",
      id: "asfr",
      kind: "numberList",
      label: "ASFR",
    },
    {
      description:
        "Female life-table person-years L(x) aligned with the rates.",
      id: "personYearsLx",
      kind: "numberList",
      label: "L(x)",
    },
    {
      default: 15,
      description: "Starting age of the first class in years.",
      id: "startingAge",
      kind: "number",
      label: "Start age",
      minimum: 0,
    },
    {
      default: 5,
      description: "Width of each age class in years.",
      id: "classWidth",
      kind: "number",
      label: "Class width",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Intrinsic annual growth rate r solving the Lotka equation.",
      id: "intrinsicGrowthRate",
      kind: "number",
      label: "r",
    },
    {
      description: "Net reproduction rate NRR = sum of f(x) L(x).",
      id: "netReproductionRate",
      kind: "number",
      label: "NRR",
    },
  ],
  calculate: (input) =>
    calculateLotkaIntrinsicGrowthRateR(
      input as unknown as LotkaIntrinsicGrowthRateRInput,
    ),
});

export const runLotkaIntrinsicGrowthRateR =
  lotkaIntrinsicGrowthRateRTool.execute;
export default lotkaIntrinsicGrowthRateRTool;
