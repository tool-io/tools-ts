import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly surfaceAccessibility: readonly number[];
  readonly minimumAccessibility: number;
}>;
export type Output = Readonly<{
  readonly exposedMethionineIndexes: readonly number[];
  readonly methionineCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    input.surfaceAccessibility.length !== s.length ||
    input.surfaceAccessibility.some((v) => v < 0 || v > 1) ||
    input.minimumAccessibility < 0 ||
    input.minimumAccessibility > 1
  )
    simpleError(
      "surfaceAccessibility",
      "Aligned per-residue accessibility fractions required.",
    );
  const exposedMethionineIndexes = [...s].flatMap((v, i) =>
    v === "M" && input.surfaceAccessibility[i] >= input.minimumAccessibility
      ? [i]
      : [],
  );
  return {
    exposedMethionineIndexes,
    methionineCount: [...s].filter((v) => v === "M").length,
  };
};
export const exampleInput = {
  sequence: "AMM",
  surfaceAccessibility: [0, 0.8, 0.2],
  minimumAccessibility: 0.5,
} satisfies Input;
export const exampleOutput = {
  exposedMethionineIndexes: [1],
  methionineCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/methionine-oxidation-screen",
  title: "Methionine Oxidation Screen",
  description:
    "Screen exposed methionines as oxidation candidates, not measured modifications.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "surfaceAccessibility",
      label: "Surface accessibility",
      kind: "numberList",
    },
    {
      id: "minimumAccessibility",
      label: "Minimum accessibility",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "exposedMethionineIndexes",
      label: "Exposed methionine indexes",
      kind: "numberList",
    },
    { id: "methionineCount", label: "Methionine count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      surfaceAccessibility: value.surfaceAccessibility as readonly number[],
      minimumAccessibility: value.minimumAccessibility as number,
    }),
});
export const run = tool.execute;
export default tool;
