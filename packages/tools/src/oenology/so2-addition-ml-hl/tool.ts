import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type So2AdditionMlHlInput = {
  readonly solutionStrengthPercent?: number;
  readonly targetIncreaseMgPerL: number;
};

export type So2AdditionMlHlOutput = {
  readonly millilitersPerHectoliter: number;
};

export const so2AdditionMlHlExample = {
  input: {
    solutionStrengthPercent: 10,
    targetIncreaseMgPerL: 30,
  },
  output: {
    millilitersPerHectoliter: 30,
  },
} satisfies ToolExample<So2AdditionMlHlInput, So2AdditionMlHlOutput>;

export const calculateSo2AdditionMlHl = (
  input: So2AdditionMlHlInput,
): So2AdditionMlHlOutput => {
  const strength = input.solutionStrengthPercent ?? 10;
  if (strength <= 0)
    simpleError(
      "solutionStrengthPercent",
      "The solution strength must be positive.",
      "invalid_value",
    );
  return {
    millilitersPerHectoliter: roundStatistic(
      (input.targetIncreaseMgPerL * 100) / (strength * 10),
    ),
  };
};

export const so2AdditionMlHlTool = createSimpleTool({
  calculate: (input) =>
    calculateSo2AdditionMlHl(input as unknown as So2AdditionMlHlInput),
  description:
    "Convert a desired SO2 increase into milliliters of sulfur solution per hectoliter of wine.",
  id: "oenology/so2-addition-ml-hl",
  inputs: [
    {
      default: 10,
      description:
        "Weight-volume strength of the sulfur solution, ten percent by default.",
      id: "solutionStrengthPercent",
      kind: "number",
      label: "Solution strength",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Desired free SO2 increase.",
      id: "targetIncreaseMgPerL",
      kind: "number",
      label: "Target increase",
      minimum: 0,
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      description: "Sulfur solution to add per hectoliter.",
      id: "millilitersPerHectoliter",
      kind: "number",
      label: "mL per hL",
      unit: "mL/hL",
    },
  ],
  title: "SO2 Addition mL per hL Calculator",
});
export const runSo2AdditionMlHl = so2AdditionMlHlTool.execute;
export default so2AdditionMlHlTool;
