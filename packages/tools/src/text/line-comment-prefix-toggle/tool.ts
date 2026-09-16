import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  lines,
} from "../batch53-shared.js";

export type Input = Readonly<{ text: string; prefix: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "prefix", label: "Prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.prefix || /[\r\n]/.test(i.prefix))
    simpleError("prefix", "Nonempty single-line prefix.");
  const a = lines(i.text),
    all = a.every((r) => r.text.startsWith(i.prefix));
  return {
    action: all ? "remove" : "add",
    text: a
      .map(
        (r) =>
          (all ? r.text.slice(i.prefix.length) : i.prefix + r.text) + r.eol,
      )
      .join(""),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\nb", prefix: "# " },
  output: { result: { action: "add", text: "# a\n# b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/line-comment-prefix-toggle",
  title: "Literal Line Comment Prefix Toggle",
  description:
    "Toggle a literal comment prefix at column zero for all hard lines: remove only when every line has it, otherwise add to all.",
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
