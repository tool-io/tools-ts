import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedComparisonStartToken: number;
  readonly annotatedComparisonEndExclusive: number;
  readonly totalLineTokens: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedComparisonStartToken",
    label: "Annotated comparison start token",
    kind: "number",
  },
  {
    id: "annotatedComparisonEndExclusive",
    label: "Annotated comparison end exclusive",
    kind: "number",
  },
  { id: "totalLineTokens", label: "Total line tokens", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.totalLineTokens, "tokens", 1, 1000000);
  bounded(
    input.annotatedComparisonStartToken,
    "start",
    0,
    input.totalLineTokens,
  );
  bounded(
    input.annotatedComparisonEndExclusive,
    "end",
    input.annotatedComparisonStartToken,
    input.totalLineTokens,
  );
  return {
    annotatedComparisonTokens:
      input.annotatedComparisonEndExclusive -
      input.annotatedComparisonStartToken,
    comparisonTokenFraction:
      (input.annotatedComparisonEndExclusive -
        input.annotatedComparisonStartToken) /
      input.totalLineTokens,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    annotatedComparisonStartToken: 5,
    annotatedComparisonEndExclusive: 20,
    totalLineTokens: 25,
  },
  output: {
    result: { annotatedComparisonTokens: 15, comparisonTokenFraction: 0.6 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/epic-simile-expanded-comparison-span-detector",
  title: "Epic Simile Expanded Comparison Span Detector",
  description:
    "Measure independently annotated epic-comparison span; no semantic simile or Homeric allusion detection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
