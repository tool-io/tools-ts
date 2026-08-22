import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentRatioInput = {
  readonly currentAssets: number;
  readonly currentLiabilities: number;
};

export type CurrentRatioOutput = {
  readonly currentRatio: number;
};

export const currentRatioExample = {
  input: { currentAssets: 150000, currentLiabilities: 100000 },
  output: { currentRatio: 1.5 },
} satisfies ToolExample<CurrentRatioInput, CurrentRatioOutput>;

export const calculateCurrentRatio = (
  input: CurrentRatioInput,
): CurrentRatioOutput => {
  const { currentAssets, currentLiabilities } = input;
  if (currentLiabilities === 0)
    simpleError(
      "currentLiabilities",
      "Current liabilities must not be zero.",
      "invalid_current_liabilities",
    );
  return { currentRatio: currentAssets / currentLiabilities };
};

export const currentRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateCurrentRatio(input as unknown as CurrentRatioInput),
  description:
    "Calculate liquidity as current assets divided by current liabilities.",
  id: "finance/current-ratio",
  inputs: [
    {
      description: "Assets expected to convert to cash within one year.",
      id: "currentAssets",
      kind: "number",
      label: "Current assets",
      unit: "currency",
    },
    {
      description: "Obligations due within one year.",
      id: "currentLiabilities",
      kind: "number",
      label: "Current liabilities",
      unit: "currency",
    },
  ],
  outputs: [
    {
      description: "Current assets per unit of current liabilities.",
      format: "ratio",
      id: "currentRatio",
      kind: "number",
      label: "Current ratio",
    },
  ],
  title: "Current Ratio Calculator",
});
export const runCurrentRatio = currentRatioTool.execute;
export default currentRatioTool;
