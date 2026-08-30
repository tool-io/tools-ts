import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedCounts: readonly number[];
  readonly ambientProfile: readonly number[];
  readonly ambientMolecules: number;
}>;
export type Output = Readonly<{
  readonly correctedCounts: readonly number[];
  readonly removedMolecules: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.observedCounts.length === 0 ||
    input.observedCounts.length !== input.ambientProfile.length ||
    input.observedCounts.some((v) => v < 0) ||
    input.ambientProfile.some((v) => v < 0) ||
    input.ambientMolecules < 0
  )
    simpleError(
      "observedCounts",
      "Aligned nonnegative counts and ambient profile are required.",
    );
  const total = input.ambientProfile.reduce((a, b) => a + b, 0);
  if (total <= 0)
    simpleError("ambientProfile", "Ambient profile must have positive mass.");
  const correctedCounts = input.observedCounts.map((v, i) =>
    Math.max(0, v - (input.ambientMolecules * input.ambientProfile[i]) / total),
  );
  return {
    correctedCounts,
    removedMolecules: input.observedCounts.reduce(
      (s, v, i) => s + v - correctedCounts[i],
      0,
    ),
  };
};

export const exampleInput = {
  observedCounts: [100, 50],
  ambientProfile: [0.5, 0.5],
  ambientMolecules: 20,
} satisfies Input;
export const exampleOutput = {
  correctedCounts: [90, 40],
  removedMolecules: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/ambient-rna-correction",
  title: "Ambient RNA Correction",
  description:
    "Subtract a caller-estimated ambient RNA component from cell counts.",
  inputs: [
    { id: "observedCounts", kind: "numberList", label: "Observed counts" },
    { id: "ambientProfile", kind: "numberList", label: "Ambient profile" },
    { id: "ambientMolecules", kind: "number", label: "Ambient molecules" },
  ],
  outputs: [
    { id: "correctedCounts", kind: "numberList", label: "Corrected counts" },
    { id: "removedMolecules", kind: "number", label: "Removed molecules" },
  ],
  calculate: (value) =>
    calculate({
      observedCounts: value.observedCounts as readonly number[],
      ambientProfile: value.ambientProfile as readonly number[],
      ambientMolecules: value.ambientMolecules as number,
    }),
});
export const run = tool.execute;
export default tool;
