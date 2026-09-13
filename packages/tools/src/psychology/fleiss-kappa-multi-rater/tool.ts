import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  bounded,
  sum,
  mean,
  shape,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSubjectByCategoryRaterCounts: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSubjectByCategoryRaterCounts",
    label: "Actual subject by category rater counts",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = input.actualSubjectByCategoryRaterCounts,
    c = shape(a, "counts");
  if (c < 2 || a.length < 2)
    simpleError("counts", "Actual≥2subjects/categories.");
  a.flat().forEach((v) => bounded(v, "count", 0, 1000000));
  const k = sum(a[0]);
  if (k < 2 || a.some((r) => sum(r) !== k))
    simpleError("raters", "Same≥2raters per actual subject.");
  const pe = sum(
      Array.from(
        { length: c },
        (_, j) => (sum(a.map((r) => r[j])) / (a.length * k)) ** 2,
      ),
    ),
    po = mean(a.map((r) => (sum(r.map((v) => v * v)) - k) / (k * (k - 1))));
  positive(1 - pe, "chancecomplement");
  return { fleissKappa: (po - pe) / (1 - pe) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSubjectByCategoryRaterCounts: [
      [2, 0],
      [0, 2],
    ],
  },
  output: { result: { fleissKappa: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/fleiss-kappa-multi-rater",
  title: "Fleiss' Kappa Multi-Rater Agreement",
  description:
    "Fleiss multi-rater categorical kappa from actual count matrix, equal rater count; not Cohen pairwise agreement or weighted ordinal coding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
