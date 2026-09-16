import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  span,
  lines,
} from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  start: number;
  end: number;
  indent: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
  { id: "indent", label: "Indent", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  span(i.start, i.end, i.text.length);
  if (!/^[ \t]+$(?![\s\S])/.test(i.indent))
    simpleError("indent", "Nonempty literal spaces/tabs.");
  const a = lines(i.text),
    changed: number[] = [];
  const output = a
    .map((r, j) => {
      const hit =
        i.start === i.end
          ? i.start >= r.start && i.start <= r.end
          : r.start < i.end && r.end + r.eol.length > i.start;
      if (!hit) return r.text + r.eol;
      if (r.text.startsWith(i.indent)) {
        changed.push(j + 1);
        return r.text.slice(i.indent.length) + r.eol;
      }
      return r.text + r.eol;
    })
    .join("");
  return { text: output, changedLines: changed };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "  a\nb", start: 0, end: 4, indent: "  " },
  output: { result: { text: "a\nb", changedLines: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/selection-outdent-transform",
  title: "Selection Outdent Transform",
  description:
    "Transform full lines intersecting a half-open UTF-16 selection, preserving line endings. Outdent only an exact supplied prefix, without guessing tab widths.",
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
