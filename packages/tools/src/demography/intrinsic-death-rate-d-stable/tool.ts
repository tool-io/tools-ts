import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntrinsicDeathRateDStableInput = {
  readonly growthRateR: number;
  readonly ages: readonly number[];
  readonly personYearsLx: readonly number[];
  readonly deaths?: readonly number[];
  readonly deathRatesMx?: readonly number[];
};

export type IntrinsicDeathRateDStableOutput = {
  readonly deathRateD: number;
};

export const calculateIntrinsicDeathRateDStable = (
  input: IntrinsicDeathRateDStableInput,
): IntrinsicDeathRateDStableOutput => {
  const ages = input.ages;
  const personYearsLx = input.personYearsLx;
  if (!Number.isFinite(input.growthRateR))
    simpleError(
      "growthRateR",
      "The intrinsic growth rate must be finite.",
      "invalid_rate",
    );
  if (ages.length === 0)
    simpleError("ages", "Provide at least one age.", "invalid_list");
  if (ages.length !== personYearsLx.length)
    simpleError(
      "personYearsLx",
      "The person-years list must align with the age list.",
      "invalid_list",
    );
  const suppliedDeaths = input.deaths ?? [];
  const suppliedRates = input.deathRatesMx ?? [];
  if (suppliedDeaths.length === 0 && suppliedRates.length !== ages.length)
    simpleError(
      "deathRatesMx",
      "The death-rate list must align with the age list when deaths are not supplied.",
      "invalid_list",
    );
  const deaths =
    suppliedDeaths.length > 0
      ? suppliedDeaths
      : suppliedRates.map((rate, index) => rate * personYearsLx[index]!);
  if (deaths.length === 0)
    simpleError(
      "deaths",
      "Provide either a deaths list or a death-rate list.",
      "invalid_list",
    );
  if (deaths.length !== ages.length)
    simpleError(
      "deaths",
      "The death list must align with the age list.",
      "invalid_list",
    );
  for (const value of ages)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "ages",
        "Ages must be finite and non-negative.",
        "invalid_list",
      );
  for (const value of personYearsLx)
    if (!(typeof value === "number" && Number.isFinite(value) && value > 0))
      simpleError(
        "personYearsLx",
        "Person-years values must be finite and positive.",
        "invalid_list",
      );
  for (const value of deaths)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "deaths",
        "Deaths and derived deaths must be finite and non-negative.",
        "invalid_list",
      );
  let numerator = 0;
  let denominator = 0;
  for (let index = 0; index < ages.length; index += 1) {
    const discount = Math.exp(-input.growthRateR * ages[index]!);
    numerator += discount * deaths[index]!;
    denominator += discount * personYearsLx[index]!;
  }
  if (!(denominator > 0))
    simpleError(
      "personYearsLx",
      "The discounted exposure sum must be positive.",
      "invalid_list",
    );
  return { deathRateD: numerator / denominator };
};

export const intrinsicDeathRateDStableExample = {
  input: {
    growthRateR: 0.01,
    ages: [0, 30, 60],
    personYearsLx: [1, 0.97, 0.5],
    deaths: [0.002, 0.0015, 0.05],
  },
  output: { deathRateD: 0.015329561927486947 },
} satisfies ToolExample<
  IntrinsicDeathRateDStableInput,
  IntrinsicDeathRateDStableOutput
>;

export const intrinsicDeathRateDStableTool = createSimpleTool({
  id: "demography/intrinsic-death-rate-d-stable",
  title: "Intrinsic Death Rate D Stable Calculator",
  description:
    "Compute the stable-population intrinsic death rate d as the growth-discounted weighted average of age-specific deaths per person-year, accepting deaths directly or death rates times L(x).",
  inputs: [
    {
      description: "Intrinsic annual growth rate r of the stable population.",
      id: "growthRateR",
      kind: "number",
      label: "Growth rate r",
    },
    {
      description: "Age at the start of each group in years.",
      id: "ages",
      kind: "numberList",
      label: "Ages",
    },
    {
      description:
        "Life-table person-years L(x) per unit radix aligned with the ages.",
      id: "personYearsLx",
      kind: "numberList",
      label: "L(x)",
    },
    {
      default: [],
      description:
        "Annual deaths in each group; supply this or the rates below.",
      id: "deaths",
      kind: "numberList",
      label: "Deaths",
    },
    {
      default: [],
      description:
        "Age-specific death rates m(x); multiplied by L(x) when no deaths list is given.",
      id: "deathRatesMx",
      kind: "numberList",
      label: "Rates m(x)",
    },
  ],
  outputs: [
    {
      description: "Intrinsic annual death rate d of the stable population.",
      id: "deathRateD",
      kind: "number",
      label: "d",
    },
  ],
  calculate: (input) =>
    calculateIntrinsicDeathRateDStable(
      input as unknown as IntrinsicDeathRateDStableInput,
    ),
});

export const runIntrinsicDeathRateDStable =
  intrinsicDeathRateDStableTool.execute;
export default intrinsicDeathRateDStableTool;
