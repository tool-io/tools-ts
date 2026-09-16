import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, occurrences } from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  needle: string;
  replacement: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "needle", label: "Needle", kind: "string" },
  { id: "replacement", label: "Replacement", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const token = (c: string | undefined) =>
    c !== undefined && /[A-Za-z0-9_]/.test(c);
  const hits = occurrences(i.text, i.needle, false).filter(
    (j) => !token(i.text[j - 1]) && !token(i.text[j + i.needle.length]),
  );
  let text = i.text;
  for (const j of [...hits].reverse())
    text = text.slice(0, j) + i.replacement + text.slice(j + i.needle.length);
  return { text, matchOffsets: hits };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "cat cats cat", needle: "cat", replacement: "dog" },
  output: { result: { text: "dog cats dog", matchOffsets: [0, 9] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/whole-token-literal-replacer",
  title: "Whole Token Literal Replacer",
  description:
    "Replace whole tokens under an explicit ASCII letter/digit/underscore boundary rule; Unicode word segmentation is not inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
