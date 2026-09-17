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
  return H.finish({
    classes: i.labels.map((label, j) => {
      const outgoing = i.matrix[j].reduce(
          (s, x, k) => s + (k === j ? 0 : x),
          0,
        ),
        incoming = i.matrix.reduce(
          (s, row, k) => s + (k === j ? 0 : row[j]),
          0,
        );
      return { label, incoming, outgoing, imbalance: incoming - outgoing };
    }),
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
    result: {
      classes: [
        { label: "a", incoming: 0, outgoing: 1, imbalance: -1 },
        { label: "b", incoming: 1, outgoing: 0, imbalance: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-error-flow-imbalance",
  title: "Confusion Error Flow Imbalance",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; compare incoming versus outgoing off-diagonal error weight for each label, retaining signed class error-flow imbalance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
