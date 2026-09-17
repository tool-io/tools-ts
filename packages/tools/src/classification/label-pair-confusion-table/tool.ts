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
  return H.finish({
    labels: [...i.labels],
    matrix: H.confusionBuild(i.actual, i.predicted, i.labels),
  });
};
export const example = {
  input: {
    actual: ["a", "a", "a", "b"],
    predicted: ["a", "a", "b", "b"],
    labels: ["a", "b"],
  },
  output: {
    result: {
      labels: ["a", "b"],
      matrix: [
        [2, 1],
        [0, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/label-pair-confusion-table",
  title: "Label Pair Confusion Table",
  description:
    "Build an occurrence-count multiclass confusion table over explicit actual/predicted label observations with a caller-ordered complete label universe; unknown labels reject, no identity coercion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
