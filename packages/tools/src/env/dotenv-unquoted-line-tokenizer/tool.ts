import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ line: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "line", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(!/[\r\n\u0000]/.test(i.line));
  const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(i.line);
  H.check(m);
  const raw = m![2];
  H.check(!/["'$]/.test(raw) && !raw.includes(String.fromCharCode(92)));
  let at = -1;
  for (let j = 0; j < raw.length; j++)
    if (raw[j] === "#" && (j === 0 || /[ \t]/.test(raw[j - 1]))) {
      at = j;
      break;
    }
  const value = (at < 0 ? raw : raw.slice(0, at)).trimEnd();
  return H.finish({
    name: m![1],
    value,
    comment: at < 0 ? null : raw.slice(at),
  });
};
export const example = {
  input: { line: " A=hello # note" },
  output: { result: { name: "A", value: "hello", comment: "# note" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "env/dotenv-unquoted-line-tokenizer",
  title: "Restricted Dotenv Unquoted Line Tokenizer",
  description:
    "Tokenize a restricted unquoted dotenv assignment with portable ASCII name and comments beginning at start or after whitespace; rejects quoting, interpolation and multiline syntax.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
