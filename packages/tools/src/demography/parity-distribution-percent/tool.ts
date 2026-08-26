import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParityDistributionPercentInput = {
  readonly womenByParity: readonly number[];
};

export type ParityDistributionPercentOutput = {
  readonly percentages: number[];
};

export const calculateParityDistributionPercent = (
  input: ParityDistributionPercentInput,
): ParityDistributionPercentOutput => {
  const counts = input.womenByParity;
  if (counts.length === 0)
    simpleError(
      "womenByParity",
      "Provide at least one parity group.",
      "invalid_list",
    );
  for (const value of counts)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "womenByParity",
        "Parity counts must be finite and non-negative.",
        "invalid_list",
      );
  let total = 0;
  for (const value of counts) total += value;
  if (!(total > 0))
    simpleError(
      "womenByParity",
      "The total number of women must be positive.",
      "invalid_list",
    );
  return { percentages: counts.map((value) => (value / total) * 100) };
};

export const parityDistributionPercentExample = {
  input: { womenByParity: [100, 60, 30, 10] },
  output: { percentages: [50, 30, 15, 5] },
} satisfies ToolExample<
  ParityDistributionPercentInput,
  ParityDistributionPercentOutput
>;

export const parityDistributionPercentTool = createSimpleTool({
  id: "demography/parity-distribution-percent",
  title: "Parity Distribution Percent Calculator",
  description:
    "Convert counts of women at each parity into a percentage distribution of all women.",
  inputs: [
    {
      description: "Number of women at each parity starting with parity zero.",
      id: "womenByParity",
      kind: "numberList",
      label: "Women by parity",
    },
  ],
  outputs: [
    {
      description: "Percentage of women in each parity class.",
      id: "percentages",
      kind: "numberList",
      label: "Percent",
    },
  ],
  calculate: (input) =>
    calculateParityDistributionPercent(
      input as unknown as ParityDistributionPercentInput,
    ),
});

export const runParityDistributionPercent =
  parityDistributionPercentTool.execute;
export default parityDistributionPercentTool;
