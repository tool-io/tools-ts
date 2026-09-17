import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ tokens: H.quotedTokens(i.text) });
};
export const example = {
  input: { text: '"a b" "c\\n" ""' },
  output: { result: { tokens: ["a b", "c\n", ""] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/quoted-token-list",
  title: "Quoted Token List Parser",
  description:
    "Parse whitespace-separated double-quoted JSON string tokens only, preserving literal spaces and decoded JSON escapes; no shell execution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
