import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly proteinIds: readonly string[];
  readonly abundanceMatrix: readonly (readonly number[])[];
  readonly missingSentinel: number;
}>;
export type Output = Readonly<{
  readonly missingFractions: readonly number[];
  readonly mostMissingProteinId: string;
}>;
export const calculate = (input: Input): Output => {
  const n = input.proteinIds.length,
    m = input.abundanceMatrix;
  if (
    n === 0 ||
    m.length !== n ||
    m.some((row) => row.length === 0 || row.length !== m[0].length)
  )
    simpleError(
      "abundanceMatrix",
      "Aligned rectangular protein abundance matrix required.",
    );
  const missingFractions = m.map(
    (row) => row.filter((v) => v === input.missingSentinel).length / row.length,
  );
  return {
    missingFractions,
    mostMissingProteinId:
      input.proteinIds[missingFractions.indexOf(Math.max(...missingFractions))],
  };
};
export const exampleInput = {
  proteinIds: ["a", "b"],
  abundanceMatrix: [
    [1, 0, 2],
    [0, 0, 3],
  ],
  missingSentinel: 0,
} satisfies Input;
export const exampleOutput = {
  missingFractions: [0.3333333333333333, 0.6666666666666666],
  mostMissingProteinId: "b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-missing-fraction",
  title: "Protein Missing Fraction",
  description:
    "Score per-protein missing measurement fractions in an abundance matrix.",
  inputs: [
    { id: "proteinIds", label: "Protein ids", kind: "stringList" },
    { id: "abundanceMatrix", label: "Abundance matrix", kind: "matrix" },
    { id: "missingSentinel", label: "Missing sentinel", kind: "number" },
  ],
  outputs: [
    { id: "missingFractions", label: "Missing fractions", kind: "numberList" },
    {
      id: "mostMissingProteinId",
      label: "Most missing protein id",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      proteinIds: value.proteinIds as readonly string[],
      abundanceMatrix: value.abundanceMatrix as readonly (readonly number[])[],
      missingSentinel: value.missingSentinel as number,
    }),
});
export const run = tool.execute;
export default tool;
