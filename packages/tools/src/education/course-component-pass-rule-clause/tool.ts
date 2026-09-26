import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  score: number;
  threshold: number;
  required: boolean;
  equalityPasses: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "score", label: "Score", kind: "number" },
  { id: "threshold", label: "Threshold", kind: "number" },
  { id: "required", label: "Required", kind: "boolean" },
  { id: "equalityPasses", label: "Equality passes", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const pass = i.equalityPasses
    ? i.score >= i.threshold
    : i.score > i.threshold;
  return H.finish({
    criterionPassed: pass,
    clauseSatisfied: !i.required || pass,
  });
};
export const example = {
  input: { score: 5, threshold: 5, required: true, equalityPasses: false },
  output: { result: { criterionPassed: false, clauseSatisfied: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "education/course-component-pass-rule-clause",
  title: "Education: Course Component Pass Rule Clause Tool",
  description:
    "Evaluate one explicitly supplied required/optional course-component pass clause, including threshold equality policy; no full course grading or policy inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          clauseSatisfied: { type: "boolean" },
          criterionPassed: { type: "boolean" },
        },
        required: ["clauseSatisfied", "criterionPassed"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
