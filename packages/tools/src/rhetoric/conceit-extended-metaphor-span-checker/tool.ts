import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedMetaphorTokenStart: number;
  readonly independentlyAnnotatedMetaphorTokenEndExclusive: number;
  readonly totalTokens: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedMetaphorTokenStart",
    label: "Independently annotated metaphor token start",
    kind: "number",
  },
  {
    id: "independentlyAnnotatedMetaphorTokenEndExclusive",
    label: "Independently annotated metaphor token end exclusive",
    kind: "number",
  },
  { id: "totalTokens", label: "Total tokens", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.totalTokens, "tokens", 1, 1000000);
  bounded(
    input.independentlyAnnotatedMetaphorTokenStart,
    "start",
    0,
    input.totalTokens,
  );
  bounded(
    input.independentlyAnnotatedMetaphorTokenEndExclusive,
    "end",
    input.independentlyAnnotatedMetaphorTokenStart,
    input.totalTokens,
  );
  return {
    annotatedSpanTokens:
      input.independentlyAnnotatedMetaphorTokenEndExclusive -
      input.independentlyAnnotatedMetaphorTokenStart,
    annotatedSpanFraction:
      (input.independentlyAnnotatedMetaphorTokenEndExclusive -
        input.independentlyAnnotatedMetaphorTokenStart) /
      input.totalTokens,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedMetaphorTokenStart: 4,
    independentlyAnnotatedMetaphorTokenEndExclusive: 10,
    totalTokens: 20,
  },
  output: { result: { annotatedSpanTokens: 6, annotatedSpanFraction: 0.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/conceit-extended-metaphor-span-checker",
  title: "Conceit Extended Metaphor Span Checker",
  description:
    "Measure independently annotated half-open extended-metaphor span; span alone does not establish a conceit.",
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
