import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntrinsicBirthRateBStableInput = {
  readonly growthRateR: number;
  readonly ages: readonly number[];
  readonly personYearsLx: readonly number[];
};

export type IntrinsicBirthRateBStableOutput = {
  readonly birthRateB: number;
  readonly deathRateD: number;
};

export const calculateIntrinsicBirthRateBStable = (
  input: IntrinsicBirthRateBStableInput,
): IntrinsicBirthRateBStableOutput => {
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
  let total = 0;
  for (let index = 0; index < ages.length; index += 1)
    total +=
      Math.exp(-input.growthRateR * ages[index]!) * personYearsLx[index]!;
  if (!(total > 0))
    simpleError(
      "personYearsLx",
      "The discounted exposure sum must be positive.",
      "invalid_list",
    );
  const birthRateB = 1 / total;
  const deathRateD = birthRateB - input.growthRateR;
  if (deathRateD < 0)
    simpleError(
      "growthRateR",
      "The growth rate cannot exceed the implied birth rate because that would produce a negative death rate.",
      "inconsistent_inputs",
    );
  return { birthRateB, deathRateD };
};

export const intrinsicBirthRateBStableExample = {
  input: {
    growthRateR: 0.01,
    ages: [0, 30, 60],
    personYearsLx: [1, 0.97, 0.5],
  },
  output: { birthRateB: 0.5017562743792562, deathRateD: 0.4917562743792562 },
} satisfies ToolExample<
  IntrinsicBirthRateBStableInput,
  IntrinsicBirthRateBStableOutput
>;

export const intrinsicBirthRateBStableTool = createSimpleTool({
  id: "demography/intrinsic-birth-rate-b-stable",
  title: "Intrinsic Birth Rate B Stable Calculator",
  description:
    "Compute the stable-population intrinsic birth rate b as the reciprocal of the growth-discounted person-years sum and derive the intrinsic death rate d = b - r.",
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
  ],
  outputs: [
    {
      description: "Intrinsic annual birth rate b of the stable population.",
      id: "birthRateB",
      kind: "number",
      label: "b",
    },
    {
      description: "Implied intrinsic death rate d = b - r.",
      id: "deathRateD",
      kind: "number",
      label: "d",
    },
  ],
  calculate: (input) =>
    calculateIntrinsicBirthRateBStable(
      input as unknown as IntrinsicBirthRateBStableInput,
    ),
});

export const runIntrinsicBirthRateBStable =
  intrinsicBirthRateBStableTool.execute;
export default intrinsicBirthRateBStableTool;
