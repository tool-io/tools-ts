import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly phiBinBoundaries: readonly number[];
  readonly sizeBinMassesGrams: readonly number[];
  readonly fineBoundaryPhi: number;
}>;
export type Output = Readonly<{
  readonly fineFragmentMassPercent: number;
  readonly coarseFragmentMassPercent: number;
}>;
const inputFields = [
  { id: "phiBinBoundaries", label: "Phi bin boundaries", kind: "numberList" },
  {
    id: "sizeBinMassesGrams",
    label: "Size bin masses grams",
    kind: "numberList",
  },
  { id: "fineBoundaryPhi", label: "Fine boundary phi", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sizeBinMassesGrams.forEach((v) => nonnegative(v, "sizeBinMassesGrams"));
  ordered(input.phiBinBoundaries, "phiBinBoundaries");
  aligned(
    input.phiBinBoundaries.slice(1),
    input.sizeBinMassesGrams,
    "sizeBinMassesGrams",
  );
  if (!input.phiBinBoundaries.includes(input.fineBoundaryPhi))
    simpleError(
      "fineBoundaryPhi",
      "Fine boundary must be a measured sieve-bin edge; no within-bin allocation invented.",
    );
  const total = positive(
      input.sizeBinMassesGrams.reduce((a, b) => a + b, 0),
      "sizeBinMassesGrams",
    ),
    fine = input.sizeBinMassesGrams.reduce(
      (s, v, i) =>
        s + (input.phiBinBoundaries[i] >= input.fineBoundaryPhi ? v : 0),
      0,
    ),
    fineFragmentMassPercent = (100 * fine) / total;
  return {
    fineFragmentMassPercent,
    coarseFragmentMassPercent: 100 - fineFragmentMassPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phiBinBoundaries: [-2, 0, 2, 4],
  sizeBinMassesGrams: [10, 20, 70],
  fineBoundaryPhi: 2,
} satisfies Input;
export const exampleOutput = {
  fineFragmentMassPercent: 70,
  coarseFragmentMassPercent: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/fragmentation-index-percent",
  title: "Fragmentation Index Percent",
  description:
    "Measure fine-fragment mass share at an explicit phi sieve boundary; higher phi means smaller clasts, and the result is a grain-size proxy rather than magma fragmentation efficiency.",
  inputs: inputFields,
  outputs: [
    {
      id: "fineFragmentMassPercent",
      label: "Fine fragment mass percent",
      kind: "number",
    },
    {
      id: "coarseFragmentMassPercent",
      label: "Coarse fragment mass percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      phiBinBoundaries: value.phiBinBoundaries as readonly number[],
      sizeBinMassesGrams: value.sizeBinMassesGrams as readonly number[],
      fineBoundaryPhi: value.fineBoundaryPhi as number,
    }),
});
export const run = tool.execute;
export default tool;
