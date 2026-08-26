import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpousalAgeGapMedianDifferenceInput = {
  readonly husbandAges: readonly number[];
  readonly wifeAges: readonly number[];
};

export type SpousalAgeGapMedianDifferenceOutput = {
  readonly medianAgeGap: number;
  readonly meanAgeGap: number;
};

export const calculateSpousalAgeGapMedianDifference = (
  input: SpousalAgeGapMedianDifferenceInput,
): SpousalAgeGapMedianDifferenceOutput => {
  const husbands = input.husbandAges;
  const wives = input.wifeAges;
  if (husbands.length !== wives.length)
    return simpleError(
      "wifeAges",
      "Husband and wife age lists must have the same length.",
      "invalid_list",
    );
  if (husbands.length < 1)
    return simpleError(
      "husbandAges",
      "Provide at least one couple.",
      "invalid_list",
    );
  for (const key of ["husbandAges", "wifeAges"] as const)
    for (const value of input[key])
      if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
        return simpleError(
          key,
          "Ages must be finite and non-negative.",
          "invalid_list",
        );
  const gaps = husbands.map((age, index) => age - (wives[index] as number));
  const sorted = [...gaps].sort((a, b) => a - b);
  const count = sorted.length;
  const medianAgeGap =
    count % 2 === 1
      ? (sorted[(count - 1) / 2] as number)
      : ((sorted[count / 2 - 1] as number) + (sorted[count / 2] as number)) / 2;
  let sum = 0;
  for (const gap of gaps) sum += gap;
  return { medianAgeGap, meanAgeGap: sum / count };
};

export const spousalAgeGapMedianDifferenceExample = {
  input: { husbandAges: [32, 45, 28, 51, 39], wifeAges: [29, 43, 30, 49, 37] },
  output: { medianAgeGap: 2, meanAgeGap: 1.4 },
} satisfies ToolExample<
  SpousalAgeGapMedianDifferenceInput,
  SpousalAgeGapMedianDifferenceOutput
>;

export const spousalAgeGapMedianDifferenceTool = createSimpleTool({
  id: "demography/spousal-age-gap-median-difference",
  title: "Spousal Age Gap Calculator",
  description:
    "Compute the median and mean difference between spouses' ages for paired husband-wife records.",
  inputs: [
    {
      description: "Husband's age for each couple.",
      id: "husbandAges",
      kind: "numberList",
      label: "Husbands",
    },
    {
      description: "Wife's age for each couple, aligned with the husbands.",
      id: "wifeAges",
      kind: "numberList",
      label: "Wives",
    },
  ],
  outputs: [
    {
      description: "Median of husband-minus-wife age differences.",
      id: "medianAgeGap",
      kind: "number",
      label: "Median gap",
    },
    {
      description: "Mean of husband-minus-wife age differences.",
      id: "meanAgeGap",
      kind: "number",
      label: "Mean gap",
    },
  ],
  calculate: (input) =>
    calculateSpousalAgeGapMedianDifference(
      input as unknown as SpousalAgeGapMedianDifferenceInput,
    ),
});

export const runSpousalAgeGapMedianDifference =
  spousalAgeGapMedianDifferenceTool.execute;
export default spousalAgeGapMedianDifferenceTool;
