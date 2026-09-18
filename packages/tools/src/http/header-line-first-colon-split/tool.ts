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
  const at = i.line.indexOf(":");
  H.check(at > 0);
  const name = i.line.slice(0, at);
  H.check(H.token(name));
  return H.finish({ name, value: i.line.slice(at + 1) });
};
export const example = {
  input: { line: "X-A: a:b" },
  output: { result: { name: "X-A", value: " a:b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-line-first-colon-split",
  title: "HTTP Header Line First Colon Splitter",
  description:
    "Split one HTTP field line at its first colon, validating a nonempty token name while retaining raw value whitespace; CR/LF or obs-fold are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
