import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly probePValues: readonly number[];
  readonly maximumP: number;
}>;
export type Output = Readonly<{
  readonly retainedIndexes: readonly number[];
  readonly failedIndexes: readonly number[];
  readonly failurePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.probePValues.length === 0 ||
    input.probePValues.some((v) => v < 0 || v > 1) ||
    input.maximumP < 0 ||
    input.maximumP > 1
  )
    simpleError("probePValues", "P-values must be in [0,1].");
  const retainedIndexes = input.probePValues.flatMap((v, i) =>
      v <= input.maximumP ? [i] : [],
    ),
    failedIndexes = input.probePValues.flatMap((v, i) =>
      v > input.maximumP ? [i] : [],
    );
  return {
    retainedIndexes,
    failedIndexes,
    failurePercent: (failedIndexes.length / input.probePValues.length) * 100,
  };
};

export const exampleInput = {
  probePValues: [0.01, 0.1, 0.02],
  maximumP: 0.05,
} satisfies Input;
export const exampleOutput = {
  retainedIndexes: [0, 2],
  failedIndexes: [1],
  failurePercent: 33.33333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/probe-pvalue-filter",
  title: "Probe Pvalue Filter",
  description:
    "Exclude methylation probes failing a detection p-value threshold.",
  inputs: [
    { id: "probePValues", kind: "numberList", label: "Probe p values" },
    { id: "maximumP", kind: "number", label: "Maximum p" },
  ],
  outputs: [
    { id: "retainedIndexes", kind: "numberList", label: "Retained indexes" },
    { id: "failedIndexes", kind: "numberList", label: "Failed indexes" },
    { id: "failurePercent", kind: "number", label: "Failure percent" },
  ],
  calculate: (value) =>
    calculate({
      probePValues: value.probePValues as readonly number[],
      maximumP: value.maximumP as number,
    }),
});
export const run = tool.execute;
export default tool;
