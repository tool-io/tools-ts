import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SmamSingulateMeanAgeMarriageInput = {
  readonly proportionSingle: readonly number[];
};

export type SmamSingulateMeanAgeMarriageOutput = {
  readonly smamYears: number;
  readonly proportionEverMarriedBy50: number;
};

export const calculateSmamSingulateMeanAgeMarriage = (
  input: SmamSingulateMeanAgeMarriageInput,
): SmamSingulateMeanAgeMarriageOutput => {
  const proportions = input.proportionSingle;
  if (proportions.length !== 7)
    return simpleError(
      "proportionSingle",
      "Provide exactly seven proportions single for the five-year groups from ages 15-19 through 45-49.",
      "invalid_list",
    );
  for (const value of proportions)
    if (!(value >= 0 && value <= 1))
      return simpleError(
        "proportionSingle",
        "Proportions single must lie between zero and one.",
        "invalid_list",
      );
  const last = proportions[proportions.length - 1] as number;
  if (!(last < 1))
    return simpleError(
      "proportionSingle",
      "The final proportion single must be below one, otherwise nobody ever marries and SMAM is undefined.",
      "invalid_list",
    );
  let sum = 0;
  for (const value of proportions) sum += value;
  return {
    smamYears: (15 + 5 * sum - 50 * last) / (1 - last),
    proportionEverMarriedBy50: 1 - last,
  };
};

export const smamSingulateMeanAgeMarriageExample = {
  input: { proportionSingle: [0.873, 0.573, 0.348, 0.22, 0.148, 0.104, 0.079] },
  output: { smamYears: 24.728555917481, proportionEverMarriedBy50: 0.921 },
} satisfies ToolExample<
  SmamSingulateMeanAgeMarriageInput,
  SmamSingulateMeanAgeMarriageOutput
>;

export const smamSingulateMeanAgeMarriageTool = createSimpleTool({
  id: "demography/smam-singulate-mean-age-marriage",
  title: "SMAM Calculator",
  description:
    "Compute the singulate mean age at marriage from proportions single in five-year groups starting at 15-19, assuming no marriage below 15 and that those still single in the last group (45-49) never marry.",
  inputs: [
    {
      description:
        "Proportion never married in each five-year age group, starting with 15-19; the last listed group is treated as the 45-49 proxy for age 50.",
      id: "proportionSingle",
      kind: "numberList",
      label: "Proportion single",
    },
  ],
  outputs: [
    {
      description:
        "Mean number of years lived single by those who marry before 50.",
      id: "smamYears",
      kind: "number",
      label: "SMAM",
    },
    {
      description: "Implied proportion ever married by age 50.",
      id: "proportionEverMarriedBy50",
      kind: "number",
      label: "Ever married",
    },
  ],
  calculate: (input) =>
    calculateSmamSingulateMeanAgeMarriage(
      input as unknown as SmamSingulateMeanAgeMarriageInput,
    ),
});

export const runSmamSingulateMeanAgeMarriage =
  smamSingulateMeanAgeMarriageTool.execute;
export default smamSingulateMeanAgeMarriageTool;
