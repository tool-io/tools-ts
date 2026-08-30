import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly geneIds: readonly string[];
  readonly logExpressions: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly mValues: readonly number[];
  readonly mostStableGeneId: string;
}>;

export const calculate = (input: Input): Output => {
  const n = input.geneIds.length,
    k = input.logExpressions[0]?.length;
  if (
    n < 3 ||
    input.logExpressions.length !== n ||
    !k ||
    k < 2 ||
    input.logExpressions.some((r) => r.length !== k)
  )
    simpleError(
      "logExpressions",
      "Three aligned gene profiles and two samples are required.",
    );
  const mValues = input.logExpressions.map((r, i) => {
    let sum = 0;
    for (let j = 0; j < n; j++)
      if (i !== j) {
        const ratios = r.map((v, t) => v - input.logExpressions[j][t]),
          mean = ratios.reduce((a, b) => a + b, 0) / k;
        sum += Math.sqrt(ratios.reduce((s, v) => s + (v - mean) ** 2, 0) / k);
      }
    return sum / (n - 1);
  });
  return {
    mValues,
    mostStableGeneId: input.geneIds[mValues.indexOf(Math.min(...mValues))],
  };
};

export const exampleInput = {
  geneIds: ["a", "b", "c"],
  logExpressions: [
    [1, 2, 3],
    [1, 2, 4],
    [1, 2, 5],
  ],
} satisfies Input;
export const exampleOutput = {
  mValues: [0.7071067811865475, 0.4714045207910317, 0.7071067811865475],
  mostStableGeneId: "b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/genorm-m-value",
  title: "Genorm M Value",
  description:
    "Rate candidate reference genes by mean pairwise log-expression variation.",
  inputs: [
    { id: "geneIds", kind: "stringList", label: "Gene ids" },
    { id: "logExpressions", kind: "matrix", label: "Log expressions" },
  ],
  outputs: [
    { id: "mValues", kind: "numberList", label: "M values" },
    { id: "mostStableGeneId", kind: "string", label: "Most stable gene id" },
  ],
  calculate: (value) =>
    calculate({
      geneIds: value.geneIds as readonly string[],
      logExpressions: value.logExpressions as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
