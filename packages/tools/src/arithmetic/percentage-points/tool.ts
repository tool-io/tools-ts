import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const percentagePointsTool = createSimpleTool({
  id: "arithmetic/percentage-points",
  title: "Percentage Points Calculator",
  description:
    "Calculate the difference between two percentages expressed in percentage points.",
  inputs: [
    {
      description: "First percentage.",
      id: "percentA",
      label: "Percentage A",
      kind: "number",
      unit: "%",
    },
    {
      description: "Second percentage.",
      id: "percentB",
      label: "Percentage B",
      kind: "number",
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Difference in percentage points (A minus B).",
      id: "percentagePoints",
      label: "Percentage points",
      kind: "number",
    },
  ],
  calculate: (input) => {
    return {
      percentagePoints: (input.percentA as number) - (input.percentB as number),
    };
  },
});
export const runPercentagePoints = percentagePointsTool.execute;
export default percentagePointsTool;

export type PercentagePointsInput = {
  readonly percentA: number;
  readonly percentB: number;
};

export type PercentagePointsOutput = {
  readonly percentagePoints: number;
};

export const percentagePointsExample = {
  input: {
    percentA: 1,
    percentB: 1,
  },
  output: {
    percentagePoints: 0,
  },
} satisfies ToolExample<PercentagePointsInput, PercentagePointsOutput>;
