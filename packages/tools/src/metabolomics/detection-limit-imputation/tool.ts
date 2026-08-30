import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly signals: readonly number[];
  readonly limitOfDetection: number;
  readonly imputationFraction: number;
}>;
export type Output = Readonly<{
  readonly imputedSignals: readonly number[];
  readonly imputedIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  if (
    input.signals.some((v) => v < 0) ||
    input.limitOfDetection < 0 ||
    input.imputationFraction < 0 ||
    input.imputationFraction > 1
  )
    simpleError(
      "signals",
      "Signals, detection limit and imputation fraction must be nonnegative.",
    );
  const floor = input.limitOfDetection * input.imputationFraction,
    imputedIndexes = input.signals.flatMap((v, i) =>
      v < input.limitOfDetection ? [i] : [],
    );
  return {
    imputedSignals: input.signals.map((v) =>
      v < input.limitOfDetection ? floor : v,
    ),
    imputedIndexes,
  };
};
export const exampleInput = {
  signals: [0, 1, 10],
  limitOfDetection: 2,
  imputationFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  imputedSignals: [1, 1, 10],
  imputedIndexes: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/detection-limit-imputation",
  title: "Detection Limit Imputation",
  description:
    "Impute below-detection signals at a caller-selected fraction of the detection limit.",
  inputs: [
    { id: "signals", kind: "numberList", label: "Signals" },
    { id: "limitOfDetection", kind: "number", label: "Limit of detection" },
    { id: "imputationFraction", kind: "number", label: "Imputation fraction" },
  ],
  outputs: [
    { id: "imputedSignals", kind: "numberList", label: "Imputed signals" },
    { id: "imputedIndexes", kind: "numberList", label: "Imputed indexes" },
  ],
  calculate: (value) =>
    calculate({
      signals: value.signals as readonly number[],
      limitOfDetection: value.limitOfDetection as number,
      imputationFraction: value.imputationFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
