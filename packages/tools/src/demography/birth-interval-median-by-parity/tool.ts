import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BirthIntervalMedianByParityInput = {
  readonly intervals: readonly number[];
};

export type BirthIntervalMedianByParityOutput = {
  readonly medianInterval: number;
  readonly sampleCount: number;
};

export const calculateBirthIntervalMedianByParity = (
  input: BirthIntervalMedianByParityInput,
): BirthIntervalMedianByParityOutput => {
  const values = input.intervals;
  if (values.length === 0)
    simpleError(
      "intervals",
      "Provide at least one birth interval.",
      "invalid_list",
    );
  for (const value of values)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "intervals",
        "Intervals must be finite and non-negative.",
        "invalid_list",
      );
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const medianInterval =
    sorted.length % 2 === 1
      ? sorted[middle]!
      : (sorted[middle - 1]! + sorted[middle]!) / 2;
  return { medianInterval, sampleCount: sorted.length };
};

export const birthIntervalMedianByParityExample = {
  input: { intervals: [20.5, 18, 24, 30, 21] },
  output: { medianInterval: 21, sampleCount: 5 },
} satisfies ToolExample<
  BirthIntervalMedianByParityInput,
  BirthIntervalMedianByParityOutput
>;

export const birthIntervalMedianByParityTool = createSimpleTool({
  id: "demography/birth-interval-median-by-parity",
  title: "Birth Interval Median By Parity Calculator",
  description:
    "Compute the median length of birth intervals in months for a set of closed intervals observed at a given parity transition.",
  inputs: [
    {
      description: "Completed birth interval lengths in months.",
      id: "intervals",
      kind: "numberList",
      label: "Intervals",
    },
  ],
  outputs: [
    {
      description: "Median birth-interval length in months.",
      id: "medianInterval",
      kind: "number",
      label: "Median",
    },
    {
      description: "Number of intervals used.",
      id: "sampleCount",
      kind: "integer",
      label: "N",
    },
  ],
  calculate: (input) =>
    calculateBirthIntervalMedianByParity(
      input as unknown as BirthIntervalMedianByParityInput,
    ),
});

export const runBirthIntervalMedianByParity =
  birthIntervalMedianByParityTool.execute;
export default birthIntervalMedianByParityTool;
