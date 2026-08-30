import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedIsotopologues: readonly number[];
  readonly naturalAbundanceMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly correctedIsotopologues: readonly number[];
  readonly sumCorrected: number;
}>;
export const calculate = (input: Input): Output => {
  const a = input.naturalAbundanceMatrix,
    y = input.observedIsotopologues;
  if (y.length !== 2 || a.length !== 2 || a.some((r) => r.length !== 2))
    simpleError(
      "naturalAbundanceMatrix",
      "A two-by-two correction matrix and two observed fractions required.",
    );
  const det = a[0][0] * a[1][1] - a[0][1] * a[1][0];
  if (Math.abs(det) < 1e-12)
    simpleError("naturalAbundanceMatrix", "Correction matrix is singular.");
  const raw = [
    (a[1][1] * y[0] - a[0][1] * y[1]) / det,
    (a[0][0] * y[1] - a[1][0] * y[0]) / det,
  ];
  if (raw.some((v) => v < 0))
    simpleError(
      "observedIsotopologues",
      "Correction yields negative abundance.",
    );
  const sum = raw[0] + raw[1];
  if (sum <= 0)
    simpleError(
      "observedIsotopologues",
      "Corrected abundance must be positive.",
    );
  const correctedIsotopologues = raw.map((v) => v / sum);
  return {
    correctedIsotopologues,
    sumCorrected: correctedIsotopologues.reduce((s, v) => s + v, 0),
  };
};
export const exampleInput = {
  observedIsotopologues: [0.8, 0.2],
  naturalAbundanceMatrix: [
    [1, 0.1],
    [0, 0.9],
  ],
} satisfies Input;
export const exampleOutput = {
  correctedIsotopologues: [0.7777777777777778, 0.22222222222222224],
  sumCorrected: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/isotope-abundance-correction",
  title: "Isotope Abundance Correction",
  description: "Invert a two-isotopologue natural-abundance correction matrix.",
  inputs: [
    {
      id: "observedIsotopologues",
      kind: "numberList",
      label: "Observed isotopologues",
    },
    {
      id: "naturalAbundanceMatrix",
      kind: "matrix",
      label: "Natural abundance matrix",
    },
  ],
  outputs: [
    {
      id: "correctedIsotopologues",
      kind: "numberList",
      label: "Corrected isotopologues",
    },
    { id: "sumCorrected", kind: "number", label: "Sum corrected" },
  ],
  calculate: (value) =>
    calculate({
      observedIsotopologues: value.observedIsotopologues as readonly number[],
      naturalAbundanceMatrix:
        value.naturalAbundanceMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
