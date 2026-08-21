import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../input.js";

export type ExponentialMovingAverageInput = {
  readonly alpha?: number;
  readonly values: readonly number[];
};

export type ExponentialMovingAverageOutput = {
  readonly average: number[];
};

export const exponentialMovingAverageExample = {
  input: { alpha: 0.5, values: [2, 4, 6] },
  output: { average: [2, 3, 4.5] },
} satisfies ToolExample<
  ExponentialMovingAverageInput,
  ExponentialMovingAverageOutput
>;

export const calculateExponentialMovingAverage = (
  input: ExponentialMovingAverageInput,
): ExponentialMovingAverageOutput => {
  const values = input.values as readonly number[];
  const alpha = input.alpha ?? 0.5;
  if (!(alpha > 0) || alpha > 1)
    simpleError(
      "alpha",
      "Alpha must be between zero and one.",
      "invalid_alpha",
    );
  let previous = values[0]!;
  const average = [roundStatistic(previous)];
  for (let index = 1; index < values.length; index += 1) {
    previous = alpha * values[index]! + (1 - alpha) * previous;
    average.push(roundStatistic(previous));
  }
  return { average };
};

export const exponentialMovingAverageTool = createSimpleTool({
  calculate: (input) =>
    calculateExponentialMovingAverage(
      input as unknown as ExponentialMovingAverageInput,
    ),
  description:
    "Compute an exponential moving average series seeded with the first observation.",
  id: "statistics/exponential-moving-average",
  inputs: [
    {
      description: "Observations in time order.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
    {
      default: 0.5,
      description:
        "Smoothing weight for the newest observation; higher values react faster.",
      id: "alpha",
      kind: "number",
      label: "Alpha",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "EMA series of the same length, starting at the first value.",
      id: "average",
      kind: "numberList",
      label: "Average",
    },
  ],
  title: "Exponential Moving Average Calculator",
});
export const runExponentialMovingAverage =
  exponentialMovingAverageTool.execute;
export default exponentialMovingAverageTool;
