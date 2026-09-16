import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, lines } from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  firstLine: number;
  lastLine: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "firstLine", label: "First line", kind: "number" },
  { id: "lastLine", label: "Last line", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = lines(i.text);
  bounded(i.firstLine, "first", 1, a.length);
  bounded(i.lastLine, "last", i.firstLine, a.length);
  return {
    text: a
      .slice(i.firstLine - 1, i.lastLine)
      .map((r) => r.text + r.eol)
      .join(""),
    start: a[i.firstLine - 1].start,
    end: a[i.lastLine - 1].end + a[i.lastLine - 1].eol.length,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\nb\nc", firstLine: 2, lastLine: 2 },
  output: { result: { text: "b\n", start: 2, end: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-range-extractor",
  title: "Line Range Extractor",
  description:
    "Extract inclusive one-based hard-line ranges with original separators included for selected lines.",
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
