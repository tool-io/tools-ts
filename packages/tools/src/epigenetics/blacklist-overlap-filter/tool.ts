import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly intervalStarts: readonly number[];
  readonly intervalEnds: readonly number[];
  readonly blacklistStarts: readonly number[];
  readonly blacklistEnds: readonly number[];
}>;
export type Output = Readonly<{
  readonly retainedIntervalIndexes: readonly number[];
  readonly excludedIntervalIndexes: readonly number[];
  readonly excludedCount: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.intervalStarts.length;
  if (
    n === 0 ||
    input.intervalEnds.length !== n ||
    input.blacklistStarts.length !== input.blacklistEnds.length ||
    input.intervalStarts.some(
      (value, index) => value > input.intervalEnds[index],
    ) ||
    input.blacklistStarts.some(
      (value, index) => value > input.blacklistEnds[index],
    )
  )
    simpleError(
      "intervalStarts",
      "Aligned, ordered interval bounds are required.",
      "invalid_intervals",
    );
  const excludedIntervalIndexes = input.intervalStarts
      .map((start, index) =>
        input.blacklistStarts.some(
          (blackStart, j) =>
            start < input.blacklistEnds[j] &&
            input.intervalEnds[index] > blackStart,
        )
          ? index
          : -1,
      )
      .filter((index) => index >= 0),
    excluded = new Set(excludedIntervalIndexes),
    retainedIntervalIndexes = input.intervalStarts
      .map((_, index) => (excluded.has(index) ? -1 : index))
      .filter((index) => index >= 0);
  return {
    retainedIntervalIndexes,
    excludedIntervalIndexes,
    excludedCount: excludedIntervalIndexes.length,
  };
};

export const exampleInput = {
  intervalStarts: [0, 10, 20],
  intervalEnds: [5, 15, 25],
  blacklistStarts: [12],
  blacklistEnds: [18],
} satisfies Input;
export const exampleOutput = {
  retainedIntervalIndexes: [0, 2],
  excludedIntervalIndexes: [1],
  excludedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      intervalStarts: input.intervalStarts as readonly number[],
      intervalEnds: input.intervalEnds as readonly number[],
      blacklistStarts: input.blacklistStarts as readonly number[],
      blacklistEnds: input.blacklistEnds as readonly number[],
    }),
  description:
    "Exclude genomic intervals that overlap caller-supplied blacklist intervals.",
  id: "epigenetics/blacklist-overlap-filter",
  inputs: [
    { id: "intervalStarts", label: "Interval starts", kind: "numberList" },
    { id: "intervalEnds", label: "Interval ends", kind: "numberList" },
    { id: "blacklistStarts", label: "Blacklist starts", kind: "numberList" },
    { id: "blacklistEnds", label: "Blacklist ends", kind: "numberList" },
  ],
  outputs: [
    {
      id: "retainedIntervalIndexes",
      label: "Retained interval indexes",
      kind: "numberList",
    },
    {
      id: "excludedIntervalIndexes",
      label: "Excluded interval indexes",
      kind: "numberList",
    },
    {
      id: "excludedCount",
      label: "Excluded interval count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Blacklist Overlap Filter",
});

export const run = tool.execute;
export default tool;
