import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReferenceTrendPercentCalculatorInput = {
  readonly previousMonthQuestions: number;
  readonly currentMonthQuestions: number;
};

export type ReferenceTrendPercentCalculatorOutput = {
  readonly trendPercent: number;
  readonly absoluteChange: number;
  readonly direction: "increase" | "decrease" | "flat";
};

export const calculateReferenceTrendPercentCalculator = (
  input: ReferenceTrendPercentCalculatorInput,
): ReferenceTrendPercentCalculatorOutput => {
  if (!(
    Number.isInteger(input.previousMonthQuestions) &&
    input.previousMonthQuestions > 0
  ))
    simpleError(
      "previousMonthQuestions",
      "Previous-month questions must be a positive integer.",
    );
  if (!(
    Number.isInteger(input.currentMonthQuestions) &&
    input.currentMonthQuestions >= 0
  ))
    simpleError(
      "currentMonthQuestions",
      "Current-month questions must be a non-negative integer.",
    );
  const absoluteChange =
    input.currentMonthQuestions - input.previousMonthQuestions;
  const direction =
    absoluteChange > 0 ? "increase" : absoluteChange < 0 ? "decrease" : "flat";
  return {
    absoluteChange,
    direction,
    trendPercent: (absoluteChange / input.previousMonthQuestions) * 100,
  };
};

export const referenceTrendPercentCalculatorExample = {
  input: { previousMonthQuestions: 320, currentMonthQuestions: 352 },
  output: { trendPercent: 10, absoluteChange: 32, direction: "increase" },
} satisfies ToolExample<
  ReferenceTrendPercentCalculatorInput,
  ReferenceTrendPercentCalculatorOutput
>;

export const referenceTrendPercentCalculatorTool = createSimpleTool({
  id: "archival-studies/reference-trend-percent-calculator",
  title: "Reference Statistics Monthly Question Count Trend Percent Calculator",
  description:
    "Compute the month-over-month percent trend in archival reference desk question counts with the absolute change and its direction.",
  inputs: [
    {
      description: "Reference questions answered in the previous month.",
      id: "previousMonthQuestions",
      kind: "integer",
      label: "Previous month",
      minimum: 1,
    },
    {
      description: "Reference questions answered in the current month.",
      id: "currentMonthQuestions",
      kind: "integer",
      label: "Current month",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Percent change from the previous month.",
      id: "trendPercent",
      kind: "number",
      label: "Trend percent",
    },
    {
      description: "Question count difference between the months.",
      id: "absoluteChange",
      kind: "integer",
      label: "Absolute change",
    },
    {
      description: "Direction of the month-over-month change.",
      enum: ["increase", "decrease", "flat"],
      id: "direction",
      kind: "string",
      label: "Direction",
    },
  ],
  calculate: (input) =>
    calculateReferenceTrendPercentCalculator({
      currentMonthQuestions: input.currentMonthQuestions as number,
      previousMonthQuestions: input.previousMonthQuestions as number,
    }),
});

export const runReferenceTrendPercentCalculator =
  referenceTrendPercentCalculatorTool.execute;
export default referenceTrendPercentCalculatorTool;
