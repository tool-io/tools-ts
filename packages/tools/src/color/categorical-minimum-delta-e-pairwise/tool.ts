import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, labRows } from "../batch-shared.js";
export type Input = Readonly<{
  readonly categoricalLabRows: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly minimumPairCie76Difference: number;
  readonly closestPairIndices: readonly number[];
}>;
const inputFields = [
  { id: "categoricalLabRows", label: "Categorical lab rows", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  labRows(input.categoricalLabRows);
  if (input.categoricalLabRows.length < 2)
    simpleError("palette", "At least two measured categories required.");
  let best = Infinity,
    pair: number[] = [];
  for (let i = 0; i < input.categoricalLabRows.length; i++)
    for (let j = i + 1; j < input.categoricalLabRows.length; j++) {
      const distance = Math.hypot(
        ...input.categoricalLabRows[i].map(
          (v, k) => v - input.categoricalLabRows[j][k],
        ),
      );
      if (distance < best) {
        best = distance;
        pair = [i, j];
      }
    }
  return { minimumPairCie76Difference: best, closestPairIndices: pair };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  categoricalLabRows: [
    [50, 0, 0],
    [60, 0, 0],
    [80, 0, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  minimumPairCie76Difference: 10,
  closestPairIndices: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/categorical-minimum-delta-e-pairwise",
  title: "Categorical Minimum Delta-E Pairwise",
  description:
    "Audit all categorical same-white CIELAB palette pairs for minimum CIE76 separation, exposing closest first-ordered pair; not a scalar CIE76 alias, categorical readability guarantee or color-deficiency simulation.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumPairCie76Difference",
      label: "Minimum pair cie76 difference",
      kind: "number",
    },
    {
      id: "closestPairIndices",
      label: "Closest pair indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      categoricalLabRows:
        value.categoricalLabRows as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
