import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ groupsJson: string; labels: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "groupsJson", label: "groupsJson", kind: "string" },
  { id: "labels", label: "labels", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.groupsJson).map((v) => {
    const group = H.str(v.group),
      matrix = v.matrix as number[][];
    H.check(
      Array.isArray(matrix) &&
        matrix.every(
          (row) =>
            Array.isArray(row) &&
            row.every((x) => typeof x === "number" && Number.isFinite(x)),
        ),
    );
    H.confusion(matrix, i.labels);
    return { group, matrix };
  });
  return H.finish({
    groups: H.groups(r, (v) => v.group).map((g) => ({
      group: g.key,
      matrix: i.labels.map((_, j) =>
        i.labels.map((_, k) =>
          g.indexes.reduce((s, index) => s + r[index].matrix[j][k], 0),
        ),
      ),
    })),
  });
};
export const example = {
  input: {
    groupsJson:
      '[{"group": "x", "matrix": [[2, 1], [0, 1]]}, {"group": "x", "matrix": [[2, 1], [0, 1]]}]',
    labels: ["a", "b"],
  },
  output: {
    result: {
      groups: [
        {
          group: "x",
          matrix: [
            [4, 2],
            [0, 2],
          ],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/confusion-group-table-sum",
  title: "Confusion Group Table Sum",
  description:
    "Explicit nonnegative square confusion table with unique supplied labels, actual rows and predicted columns; sum aligned explicit subgroup confusion observations by group, preserving one output table per exact group name; no hidden label-axis alignment.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
