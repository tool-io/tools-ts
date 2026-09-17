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
  H.check(!/[\r\n]/.test(i.line));
  let quote = "",
    at = -1;
  for (let j = 0; j < i.line.length; j++) {
    const c = i.line[j];
    if (quote) {
      if (c === "\\" && quote === '"') {
        H.check(++j < i.line.length);
        continue;
      }
      if (c === quote) quote = "";
      continue;
    }
    if (c === '"' || c === String.fromCharCode(39)) {
      quote = c;
      continue;
    }
    if (c === "#" && (j === 0 || /[ \t]/.test(i.line[j - 1]))) {
      at = j;
      break;
    }
  }
  H.check(!quote);
  return H.finish({ commentSpan: at < 0 ? null : [at, i.line.length] });
};
export const example = {
  input: { line: 'A="x#y" # note' },
  output: { result: { commentSpan: [8, 14] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "env/dotenv-comment-source-spans",
  title: "Restricted Dotenv Comment Source Spans",
  description:
    "Locate an unquoted whitespace-introduced dotenv comment in one balanced single/double-quoted line; literal hash inside quotes is not a comment.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
