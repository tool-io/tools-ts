import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MovingAverageInput = {
  readonly values: readonly number[];
  readonly windowSize?: number;
};

export type MovingAverageOutput = {
  readonly averages: readonly number[];
};

export const calculateMovingAverage = (
  input: MovingAverageInput,
): MovingAverageOutput => {
  const values = input.values;
  const windowSize = input.windowSize ?? 3;
  if (!values.length)
    return simpleError("values", "values must not be empty.", "empty_list");
  if (windowSize < 1 || windowSize > values.length)
    return simpleError(
      "windowSize",
      "windowSize must satisfy 1 <= windowSize <= values.length.",
      "invalid_window",
    );
  const round = (value: number): number => Number(value.toPrecision(12));
  return {
    averages: values
      .slice(windowSize - 1)
      .map((_, start) =>
        round(
          values
            .slice(start, start + windowSize)
            .reduce((sum, v) => sum + v, 0) / windowSize,
        ),
      ),
  };
};

export const movingAverageExample = {
  input: {
    values: [1, 2, 3, 4, 5],
  },
  output: {
    averages: [2, 3, 4],
  },
} satisfies ToolExample<MovingAverageInput, MovingAverageOutput>;

export const movingAverageTool = createSimpleTool({
  id: "statistics/moving-average",
  title: "Moving Average",
  description:
    "Smooth a series into arithmetic means over overlapping fixed-size windows.",
  inputs: [
    {
      description: "Series to smooth.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
    {
      description: "Number of consecutive elements averaged per output value.",
      default: 3,
      id: "windowSize",
      kind: "integer",
      label: "Window size",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "One mean per window; length is values.length - windowSize + 1.",
      id: "averages",
      kind: "numberList",
      label: "averages",
    },
  ],
  calculate: (input) =>
    calculateMovingAverage({
      values: input.values as readonly number[],
      windowSize: input.windowSize as number,
    }),
});

export const runMovingAverage = movingAverageTool.execute;
export default movingAverageTool;
