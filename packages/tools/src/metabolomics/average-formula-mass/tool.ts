import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly elementSymbols: readonly string[];
  readonly atomCounts: readonly number[];
  readonly averageAtomicWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly averageFormulaMass: number;
  readonly atomTotal: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.elementSymbols.length;
  if (
    n === 0 ||
    input.atomCounts.length !== n ||
    input.averageAtomicWeights.length !== n ||
    input.atomCounts.some((v) => v < 0 || !Number.isSafeInteger(v)) ||
    input.averageAtomicWeights.some((v) => v <= 0)
  )
    simpleError(
      "atomCounts",
      "Aligned counts and caller-provided average atomic weights required.",
    );
  return {
    averageFormulaMass: input.atomCounts.reduce(
      (s, v, i) => s + v * input.averageAtomicWeights[i],
      0,
    ),
    atomTotal: input.atomCounts.reduce((a, b) => a + b, 0),
  };
};
export const exampleInput = {
  elementSymbols: ["C", "H", "O"],
  atomCounts: [1, 4, 1],
  averageAtomicWeights: [12, 1, 16],
} satisfies Input;
export const exampleOutput = {
  averageFormulaMass: 32,
  atomTotal: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/average-formula-mass",
  title: "Average Formula Mass",
  description:
    "Sum molecular formula mass from caller-supplied average atomic weights.",
  inputs: [
    { id: "elementSymbols", kind: "stringList", label: "Element symbols" },
    { id: "atomCounts", kind: "numberList", label: "Atom counts" },
    {
      id: "averageAtomicWeights",
      kind: "numberList",
      label: "Average atomic weights",
    },
  ],
  outputs: [
    { id: "averageFormulaMass", kind: "number", label: "Average formula mass" },
    { id: "atomTotal", kind: "number", label: "Atom total" },
  ],
  calculate: (value) =>
    calculate({
      elementSymbols: value.elementSymbols as readonly string[],
      atomCounts: value.atomCounts as readonly number[],
      averageAtomicWeights: value.averageAtomicWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
