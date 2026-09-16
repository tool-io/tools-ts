import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = lines(i.text),
    nonempty = a.filter((r) => r.text.trim().length > 0);
  let margin = nonempty.length ? nonempty[0].text.match(/^[ \t]*/)![0] : "";
  for (const r of nonempty) {
    const p = r.text.match(/^[ \t]*/)![0];
    while (!p.startsWith(margin)) margin = margin.slice(0, -1);
  }
  return {
    removedMargin: margin,
    text: a
      .map(
        (r) =>
          (r.text.startsWith(margin) ? r.text.slice(margin.length) : r.text) +
          r.eol,
      )
      .join(""),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "  a\n  b" },
  output: { result: { removedMargin: "  ", text: "a\nb" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/common-indent-margin-remover",
  title: "Common Indent Margin Remover",
  description:
    "Remove the common literal spaces/tabs margin of nonblank lines; tabs are not expanded and original separators are retained.",
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
