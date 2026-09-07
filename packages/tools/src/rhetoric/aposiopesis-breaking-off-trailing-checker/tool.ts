import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{ readonly clause: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "clause", label: "Clause", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.clause.trim()) simpleError("clause", "Nonempty explicit clause.");
  return { hasBreakingOffPunctuation: /(?:—|\.\.\.|…)\s*$/.test(input.clause) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { clause: "I would say\u2014" },
  output: { result: { hasBreakingOffPunctuation: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/aposiopesis-breaking-off-trailing-checker",
  title: "Aposiopesis Breaking Off Trailing Checker",
  description:
    "Screen explicit trailing em-dash/ellipsis markers for possible aposiopesis; not proof that a thought is incomplete or emotionally suppressed.",
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
