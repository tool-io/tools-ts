import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly signals: readonly number[];
  readonly pseudocount: number;
}>;
export type Output = Readonly<{
  readonly log2Signals: readonly number[];
  readonly rawRange: number;
  readonly transformedRange: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.signals.length === 0 ||
    input.pseudocount <= 0 ||
    input.signals.some((v) => v + input.pseudocount <= 0)
  )
    simpleError(
      "signals",
      "Positive adjusted signals and pseudocount required.",
    );
  const log2Signals = input.signals.map((v) =>
    Math.log2(v + input.pseudocount),
  );
  return {
    log2Signals,
    rawRange: Math.max(...input.signals) - Math.min(...input.signals),
    transformedRange: Math.max(...log2Signals) - Math.min(...log2Signals),
  };
};
export const exampleInput = {
  signals: [0, 1, 3],
  pseudocount: 1,
} satisfies Input;
export const exampleOutput = {
  log2Signals: [0, 1, 2],
  rawRange: 3,
  transformedRange: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/log2-skew-transform",
  title: "Log2 Skew Transform",
  description:
    "Apply a pseudocount log2 transform and measure dynamic-range compression.",
  inputs: [
    { id: "signals", kind: "numberList", label: "Signals" },
    { id: "pseudocount", kind: "number", label: "Pseudocount" },
  ],
  outputs: [
    { id: "log2Signals", kind: "numberList", label: "Log 2 signals" },
    { id: "rawRange", kind: "number", label: "Raw range" },
    { id: "transformedRange", kind: "number", label: "Transformed range" },
  ],
  calculate: (value) =>
    calculate({
      signals: value.signals as readonly number[],
      pseudocount: value.pseudocount as number,
    }),
});
export const run = tool.execute;
export default tool;
