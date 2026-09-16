import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unquoteHttp } from "../batch53-shared.js";

export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return { decoded: unquoteHttp(i.value) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: '"a\\"b"' },
  output: { result: { decoded: 'a"b' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-quoted-string-unescaper",
  title: "HTTP Quoted String Unescaper",
  description:
    "Strictly unescape one HTTP quoted-string with ASCII/obs-text validation; reject dangling escapes, CR/LF and unquoted input.",
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
