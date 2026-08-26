import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RemarriageProportionPercentInput = {
  readonly totalMarriages: number;
  readonly remarriageCount: number;
};

export type RemarriageProportionPercentOutput = {
  readonly remarriageProportionPercent: number;
  readonly firstMarriageProportionPercent: number;
};

export const calculateRemarriageProportionPercent = (
  input: RemarriageProportionPercentInput,
): RemarriageProportionPercentOutput => {
  if (!(input.totalMarriages > 0))
    return simpleError(
      "totalMarriages",
      "Total marriages must be greater than zero.",
      "invalid_marriages",
    );
  if (!(input.remarriageCount >= 0))
    return simpleError(
      "remarriageCount",
      "Remarriage count must be non-negative.",
      "invalid_marriages",
    );
  if (input.remarriageCount > input.totalMarriages)
    return simpleError(
      "remarriageCount",
      "Remarriages cannot exceed total marriages.",
      "invalid_marriages",
    );
  const remarriageProportionPercent =
    (100 * input.remarriageCount) / input.totalMarriages;
  return {
    remarriageProportionPercent,
    firstMarriageProportionPercent: 100 - remarriageProportionPercent,
  };
};

export const remarriageProportionPercentExample = {
  input: { totalMarriages: 10000, remarriageCount: 2600 },
  output: {
    remarriageProportionPercent: 26,
    firstMarriageProportionPercent: 74,
  },
} satisfies ToolExample<
  RemarriageProportionPercentInput,
  RemarriageProportionPercentOutput
>;

export const remarriageProportionPercentTool = createSimpleTool({
  id: "demography/remarriage-proportion-percent",
  title: "Remarriage Proportion Calculator",
  description:
    "Compute the percentage of marriages in a year that involve at least one previously married partner.",
  inputs: [
    {
      description: "All marriages registered in the year.",
      id: "totalMarriages",
      kind: "number",
      label: "Total marriages",
      minimum: 0,
    },
    {
      description:
        "Marriages where at least one spouse had been married before.",
      id: "remarriageCount",
      kind: "number",
      label: "Remarriages",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Remarriages as a percentage of all marriages.",
      id: "remarriageProportionPercent",
      kind: "number",
      label: "Remarriage %",
    },
    {
      description: "First marriages as a percentage of all marriages.",
      id: "firstMarriageProportionPercent",
      kind: "number",
      label: "First marriage %",
    },
  ],
  calculate: (input) =>
    calculateRemarriageProportionPercent(
      input as unknown as RemarriageProportionPercentInput,
    ),
});

export const runRemarriageProportionPercent =
  remarriageProportionPercentTool.execute;
export default remarriageProportionPercentTool;
