import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly actualWallText: string;
  readonly callerEditorialMaximumWhitespaceWords: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualWallText", label: "Actual wall text", kind: "string" },
  {
    id: "callerEditorialMaximumWhitespaceWords",
    label: "Caller editorial maximum whitespace words",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerEditorialMaximumWhitespaceWords, "limit", 0, 1000000);
  const n = input.actualWallText.trim()
    ? input.actualWallText.trim().split(/\s+/u).length
    : 0;
  return {
    observedWhitespaceWordCount: n,
    exceedsCallerEditorialLimit:
      n > input.callerEditorialMaximumWhitespaceWords,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualWallText: "One two three.",
    callerEditorialMaximumWhitespaceWords: 3,
  },
  output: {
    result: {
      observedWhitespaceWordCount: 3,
      exceedsCallerEditorialLimit: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/wall-text-word-limit-checker",
  title: "Wall Text Word Count Attention Span Limit Checker",
  description:
    "Actual wall-text whitespace-token count versus caller editorial limit, not language-aware segmentation or universal attention span, comprehension or museum label standard.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
