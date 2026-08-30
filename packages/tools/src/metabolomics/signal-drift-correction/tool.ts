import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleSignals: readonly number[];
  readonly qcSignals: readonly number[];
  readonly referenceQcSignal: number;
}>;
export type Output = Readonly<{
  readonly correctedSignals: readonly number[];
  readonly correctionFactors: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.sampleSignals.length;
  if (
    n === 0 ||
    input.qcSignals.length !== n ||
    input.referenceQcSignal <= 0 ||
    input.qcSignals.some((v) => v <= 0)
  )
    simpleError(
      "qcSignals",
      "Aligned positive QC signals and reference required.",
    );
  const correctionFactors = input.qcSignals.map(
    (v) => input.referenceQcSignal / v,
  );
  return {
    correctedSignals: input.sampleSignals.map(
      (v, i) => v * correctionFactors[i],
    ),
    correctionFactors,
  };
};
export const exampleInput = {
  sampleSignals: [90, 100, 110],
  qcSignals: [90, 100, 110],
  referenceQcSignal: 100,
} satisfies Input;
export const exampleOutput = {
  correctedSignals: [100, 100, 100],
  correctionFactors: [1.1111111111111112, 1, 0.9090909090909091],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/signal-drift-correction",
  title: "Signal Drift Correction",
  description:
    "Correct injection-order signal drift using aligned QC trend estimates.",
  inputs: [
    { id: "sampleSignals", kind: "numberList", label: "Sample signals" },
    { id: "qcSignals", kind: "numberList", label: "Qc signals" },
    { id: "referenceQcSignal", kind: "number", label: "Reference qc signal" },
  ],
  outputs: [
    { id: "correctedSignals", kind: "numberList", label: "Corrected signals" },
    {
      id: "correctionFactors",
      kind: "numberList",
      label: "Correction factors",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleSignals: value.sampleSignals as readonly number[],
      qcSignals: value.qcSignals as readonly number[],
      referenceQcSignal: value.referenceQcSignal as number,
    }),
});
export const run = tool.execute;
export default tool;
