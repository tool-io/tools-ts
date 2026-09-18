import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  groups: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "groups", label: "groups", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.values.length === i.groups.length);
  const centers = new Map(
    H.groups(i.groups, (x) => x).map((g) => [
      g.key,
      H.mean(g.indexes.map((j) => i.values[j])),
    ]),
  );
  return H.finish({
    centered: i.values.map((x, j) => x - centers.get(i.groups[j])!),
    centers: [...centers].map(([group, value]) => ({ group, value })),
  });
};
export const example = {
  input: { values: [1, 3, 10], groups: ["a", "a", "b"] },
  output: {
    result: {
      centered: [-1, 1, 0],
      centers: [
        { group: "a", value: 2 },
        { group: "b", value: 10 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/group-mean-centered-values",
  title: "Group Mean Centered Values",
  description:
    "Center each observation by its explicit group\u2019s sample mean, retaining group-center evidence and original order; no between-group inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
