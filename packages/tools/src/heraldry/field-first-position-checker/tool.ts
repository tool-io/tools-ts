import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedFieldTinctureTokenIndex: number;
  readonly totalAnnotatedTokens: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedFieldTinctureTokenIndex",
    label: "Annotated field tincture token index",
    kind: "number",
  },
  {
    id: "totalAnnotatedTokens",
    label: "Total annotated tokens",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.totalAnnotatedTokens, "tokens", 1, 128);
  bounded(
    input.annotatedFieldTinctureTokenIndex,
    "index",
    0,
    input.totalAnnotatedTokens - 1,
  );
  return { fieldTinctureFirst: input.annotatedFieldTinctureTokenIndex === 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { annotatedFieldTinctureTokenIndex: 0, totalAnnotatedTokens: 6 },
  output: { result: { fieldTinctureFirst: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/field-first-position-checker",
  title: "Field First Tincture Position Checker",
  description:
    "Check independently annotated first field-tincture token position; no grammatical identification from arbitrary words.",
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
