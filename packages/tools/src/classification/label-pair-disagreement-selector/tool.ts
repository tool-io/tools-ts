import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  actual: readonly string[];
  predicted: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actual", label: "actual", kind: "stringList" },
  { id: "predicted", label: "predicted", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.actual.length === i.predicted.length);
  return H.finish({
    disagreements: i.actual.flatMap((actual, index) =>
      actual === i.predicted[index]
        ? []
        : [{ index, actual, predicted: i.predicted[index] }],
    ),
  });
};
export const example = {
  input: { actual: ["a", "b"], predicted: ["a", "a"] },
  output: {
    result: { disagreements: [{ index: 1, actual: "b", predicted: "a" }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/label-pair-disagreement-selector",
  title: "Label Pair Disagreement Selector",
  description:
    "Select exact actual/predicted label disagreement observations with original indexes, preserving repeated labels; no classification threshold or error severity model.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
