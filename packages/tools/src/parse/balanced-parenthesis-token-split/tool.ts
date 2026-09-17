import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string; delimiter: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
  { id: "delimiter", kind: "string", label: "delimiter" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.delimiter.length === 1 && !"()".includes(i.delimiter));
  let depth = 0;
  const tokens = [""];
  for (const c of i.text) {
    if (c === "(") depth++;
    if (c === ")") {
      depth--;
      H.check(depth >= 0);
    }
    if (c === i.delimiter && depth === 0) tokens.push("");
    else tokens[tokens.length - 1] += c;
  }
  H.check(depth === 0 && tokens.length <= 128);
  return H.finish({ tokens });
};
export const example = {
  input: { text: "a,(b,c),d", delimiter: "," },
  output: { result: { tokens: ["a", "(b,c)", "d"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/balanced-parenthesis-token-split",
  title: "Balanced Parenthesis Token Splitter",
  description:
    "Split a literal delimiter only outside balanced parentheses; parentheses are retained, quotes and escapes have no special meaning.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
