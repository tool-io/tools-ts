import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly batchOneValues: readonly number[];
  readonly batchTwoValues: readonly number[];
  readonly maximumAbsoluteStandardizedShift: number;
}>;
export type Output = Readonly<{
  readonly batchMeanDifference: number;
  readonly pooledWithinBatchStdDev: number;
  readonly standardizedShift: number;
  readonly batchEffectFlag: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = input.batchOneValues,
    b = input.batchTwoValues;
  if (a.length < 2 || b.length < 2)
    simpleError(
      "batchOneValues",
      "Each batch requires at least two measurements.",
    );
  const mean = (x: readonly number[]) =>
      x.reduce((s, v) => s + v, 0) / x.length,
    ma = mean(a),
    mb = mean(b),
    variance = (x: readonly number[], m: number) =>
      x.reduce((s, v) => s + (v - m) ** 2, 0) / x.length,
    pooledWithinBatchStdDev = Math.sqrt(
      (variance(a, ma) + variance(b, mb)) / 2,
    );
  if (pooledWithinBatchStdDev === 0)
    simpleError("batchOneValues", "Within-batch variation must be positive.");
  const batchMeanDifference = mb - ma,
    standardizedShift = batchMeanDifference / pooledWithinBatchStdDev;
  return {
    batchMeanDifference,
    pooledWithinBatchStdDev,
    standardizedShift,
    batchEffectFlag:
      Math.abs(standardizedShift) >= input.maximumAbsoluteStandardizedShift,
  };
};

export const exampleInput = {
  batchOneValues: [1, 2, 3],
  batchTwoValues: [5, 6, 7],
  maximumAbsoluteStandardizedShift: 1,
} satisfies Input;
export const exampleOutput = {
  batchMeanDifference: 4,
  pooledWithinBatchStdDev: 0.816496580927726,
  standardizedShift: 4.898979485566356,
  batchEffectFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/batch-effect-screen",
  title: "Batch Effect Screen",
  description:
    "Screen batch-level mean shifts relative to within-batch variation.",
  inputs: [
    { id: "batchOneValues", kind: "numberList", label: "Batch one values" },
    { id: "batchTwoValues", kind: "numberList", label: "Batch two values" },
    {
      id: "maximumAbsoluteStandardizedShift",
      kind: "number",
      label: "Maximum absolute standardized shift",
    },
  ],
  outputs: [
    {
      id: "batchMeanDifference",
      kind: "number",
      label: "Batch mean difference",
    },
    {
      id: "pooledWithinBatchStdDev",
      kind: "number",
      label: "Pooled within batch std dev",
    },
    { id: "standardizedShift", kind: "number", label: "Standardized shift" },
    { id: "batchEffectFlag", kind: "boolean", label: "Batch effect flag" },
  ],
  calculate: (value) =>
    calculate({
      batchOneValues: value.batchOneValues as readonly number[],
      batchTwoValues: value.batchTwoValues as readonly number[],
      maximumAbsoluteStandardizedShift:
        value.maximumAbsoluteStandardizedShift as number,
    }),
});
export const run = tool.execute;
export default tool;
