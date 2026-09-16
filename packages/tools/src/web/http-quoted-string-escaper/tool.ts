import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (/[^\t\x20-\x7e\x80-\xff]/.test(i.value))
    simpleError("value", "HTTP HTAB/SP/VCHAR/obs-text only.");
  return {
    quoted: '"' + i.value.replaceAll("\\", "\\\\").replaceAll('"', '\\"') + '"',
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: 'a"b' },
  output: { result: { quoted: '"a\\"b"' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-quoted-string-escaper",
  title: "HTTP Quoted String Escaper",
  description:
    "Escape a string as an HTTP quoted-string, quoting backslash and double quote; reject CR/LF, other controls and non-octet Unicode.",
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
