import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly reporterSignals: readonly number[];
  readonly isotopeMixingMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly correctedSignals: readonly number[];
  readonly matrixInvertible: boolean;
}>;
export const calculate = (input: Input): Output => {
  const n = input.reporterSignals.length,
    a = input.isotopeMixingMatrix;
  if (
    n === 0 ||
    a.length !== n ||
    a.some((row) => row.length !== n) ||
    input.reporterSignals.some((v) => v < 0)
  )
    simpleError(
      "isotopeMixingMatrix",
      "Square aligned isotope mixing matrix required.",
    );
  const augmented = a.map((row, i) => [...row, input.reporterSignals[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++)
      if (Math.abs(augmented[r][col]) > Math.abs(augmented[pivot][col]))
        pivot = r;
    if (Math.abs(augmented[pivot][col]) < 1e-12)
      simpleError("isotopeMixingMatrix", "Correction matrix is singular.");
    [augmented[col], augmented[pivot]] = [augmented[pivot], augmented[col]];
    const scale = augmented[col][col];
    for (let j = col; j <= n; j++) augmented[col][j] /= scale;
    for (let r = 0; r < n; r++)
      if (r !== col) {
        const factor = augmented[r][col];
        for (let j = col; j <= n; j++)
          augmented[r][j] -= factor * augmented[col][j];
      }
  }
  const correctedSignals = augmented.map((row) =>
    Math.abs(row[n]) < 1e-12 ? 0 : row[n],
  );
  if (correctedSignals.some((v) => v < 0))
    simpleError("reporterSignals", "Corrected channel intensity is negative.");
  return { correctedSignals, matrixInvertible: true };
};
export const exampleInput = {
  reporterSignals: [90, 10],
  isotopeMixingMatrix: [
    [0.9, 0.1],
    [0.1, 0.9],
  ],
} satisfies Input;
export const exampleOutput = {
  correctedSignals: [100, 0],
  matrixInvertible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/tmt-isotope-matrix-audit",
  title: "TMT Isotope Matrix Audit",
  description: "Solve a multichannel TMT isotope-crosstalk correction matrix.",
  inputs: [
    { id: "reporterSignals", label: "Reporter signals", kind: "numberList" },
    {
      id: "isotopeMixingMatrix",
      label: "Isotope mixing matrix",
      kind: "matrix",
    },
  ],
  outputs: [
    { id: "correctedSignals", label: "Corrected signals", kind: "numberList" },
    { id: "matrixInvertible", label: "Matrix invertible", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      reporterSignals: value.reporterSignals as readonly number[],
      isotopeMixingMatrix:
        value.isotopeMixingMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
