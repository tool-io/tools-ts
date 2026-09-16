import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, edits } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; editsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "editsJson", label: "Edits json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = edits(i.editsJson, i.text.length);
  let s = i.text;
  for (const e of [...a].reverse())
    s = s.slice(0, e.start) + e.text + s.slice(e.end);
  return { text: s, editCount: a.length };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "abc", editsJson: '[{"start":1,"end":2,"text":"XY"}]' },
  output: { result: { text: "aXYc", editCount: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/multiple-span-edit-applier",
  title: "Multiple Span Edit Applier",
  description:
    "Apply nonoverlapping half-open UTF-16 edits in original coordinates; duplicate starts and overlapping spans are rejected.",
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
