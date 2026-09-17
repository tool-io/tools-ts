import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly (readonly number[])[];
  labels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrix", label: "matrix", kind: "matrix" },
  { id: "labels", label: "labels", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.confusion(i.matrix, i.labels);
  const maximum = Math.max(
    0,
    ...i.matrix.flatMap((row, j) => row.filter((_, k) => j !== k)),
  );
  return H.finish({
    maximum,
    pairs: i.matrix.flatMap((row, j) =>
      row.flatMap((value, k) =>
        j !== k && value === maximum && value > 0
          ? [{ actual: i.labels[j], predicted: i.labels[k], value }]
          : [],
      ),
    ),
  });
};
export const example = {
  input: {
    matrix: [
      [2, 1],
      [0, 1],
    ],
    labels: ["a", "b"],
  },
  output: {
    result: { maximum: 1, pairs: [{ actual: "a", predicted: "b", value: 1 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-largest-offdiagonal-pairs",
  title: "Confusion Largest Offdiagonal Pairs",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; return every positive maximum off-diagonal error pair, retaining ties; an error-free table has maximum zero and no invented error pair.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
