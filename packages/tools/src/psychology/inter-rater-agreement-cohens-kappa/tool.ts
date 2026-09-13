import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  bounded,
  sum,
  shape,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualRaterConfusionCounts: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRaterConfusionCounts",
    label: "Actual rater confusion counts",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = input.actualRaterConfusionCounts,
    n = shape(a, "table");
  if (a.length !== n || n < 2) simpleError("table", "Square≥2categorytable.");
  a.flat().forEach((v) => bounded(v, "count", 0, 10000000));
  const t = positive(sum(a.flat()), "trials"),
    po = sum(a.map((r, i) => r[i])) / t,
    pe = sum(a.map((r, i) => sum(r) * sum(a.map((s) => s[i])))) / (t * t);
  positive(1 - pe, "chancecomplement");
  return { cohensKappa: (po - pe) / (1 - pe) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRaterConfusionCounts: [
      [8, 2],
      [2, 8],
    ],
  },
  output: { result: { cohensKappa: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/inter-rater-agreement-cohens-kappa",
  title: "Cohen's Kappa Inter-Rater Agreement",
  description:
    "Unweighted Cohens kappa from actual matched two-rater categorical confusion counts. Not continuous Pearson correlation, weighted ordinal kappa, diagnosis or inferential reliability interval.",
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
