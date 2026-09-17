import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  actual: readonly string[];
  predicted: readonly string[];
  labels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actual", label: "actual", kind: "stringList" },
  { id: "predicted", label: "predicted", kind: "stringList" },
  { id: "labels", label: "labels", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.actual.length === i.predicted.length &&
      H.unique(i.labels).length === i.labels.length,
  );
  return H.finish({
    unknownActual: i.actual.flatMap((label, index) =>
      i.labels.includes(label) ? [] : [{ index, label }],
    ),
    unknownPredicted: i.predicted.flatMap((label, index) =>
      i.labels.includes(label) ? [] : [{ index, label }],
    ),
  });
};
export const example = {
  input: { actual: ["a", "x"], predicted: ["y", "b"], labels: ["a", "b"] },
  output: {
    result: {
      unknownActual: [{ index: 1, label: "x" }],
      unknownPredicted: [{ index: 0, label: "y" }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/label-pair-coverage-audit",
  title: "Label Pair Coverage Audit",
  description:
    "Audit unknown label occurrences separately in aligned actual and predicted observations against an explicit label universe; do not drop or coerce unknown evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
