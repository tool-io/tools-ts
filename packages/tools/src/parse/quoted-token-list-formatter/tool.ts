import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ tokens: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tokens", kind: "stringList", label: "tokens" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ text: i.tokens.map((s) => JSON.stringify(s)).join(" ") });
};
export const example = {
  input: { tokens: ["a b", "c\n", ""] },
  output: { result: { text: '"a b" "c\\n" ""' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/quoted-token-list-formatter",
  title: "Quoted Token List Formatter",
  description:
    "Format explicit strings as whitespace-separated JSON quoted tokens; deliberately not a shell quoting or command builder.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
