import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlidingWindowInput = {
  readonly values: readonly number[];
  readonly windowSize: number;
};

export type SlidingWindowOutput = {
  readonly windows: (readonly number[])[];
  readonly count: number;
};

export const calculateSlidingWindow = (
  input: SlidingWindowInput,
): SlidingWindowOutput => {
  const values = input.values;
  const windowSize = input.windowSize;
  if (!values.length)
    return simpleError("values", "values must not be empty.", "empty_list");
  if (
    !Number.isSafeInteger(windowSize) ||
    windowSize < 1 ||
    windowSize > values.length
  )
    return simpleError(
      "windowSize",
      "windowSize must satisfy 1 <= windowSize <= values.length.",
      "invalid_window",
    );
  const windows: number[][] = [];
  for (let start = 0; start + windowSize <= values.length; start += 1)
    windows.push(values.slice(start, start + windowSize));
  return { windows, count: windows.length };
};

export const slidingWindowExample = {
  input: {
    values: [1, 2, 3, 4],
    windowSize: 2,
  },
  output: {
    windows: [
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    count: 3,
  },
} satisfies ToolExample<SlidingWindowInput, SlidingWindowOutput>;

export const slidingWindowTool = createSimpleTool({
  id: "list/sliding-window",
  title: "Sliding Window",
  description:
    "Slice a list into overlapping fixed-size windows stepped one element at a time.",
  inputs: [
    {
      description: "List to window.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
    {
      description: "Number of elements per window.",
      id: "windowSize",
      kind: "integer",
      label: "Window size",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Consecutive windows of exactly windowSize elements.",
      id: "windows",
      kind: "matrix",
      label: "Windows",
      format: "matrix",
    },
    {
      description:
        "Number of windows, which is values.length - windowSize + 1.",
      id: "count",
      kind: "integer",
      label: "count",
    },
  ],
  calculate: (input) =>
    calculateSlidingWindow({
      values: input.values as readonly number[],
      windowSize: input.windowSize as number,
    }),
});

export const runSlidingWindow = slidingWindowTool.execute;
export default slidingWindowTool;
