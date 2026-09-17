import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ token: string; allowed: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", kind: "string", label: "token" },
  { id: "allowed", kind: "stringList", label: "allowed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(H.unique(i.allowed).length === i.allowed.length);
  return H.finish({ member: i.allowed.includes(i.token) });
};
export const example = {
  input: { token: "A", allowed: ["A", "B"] },
  output: { result: { member: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/literal-enumeration-token-check",
  title: "Literal Enumeration Token Check",
  description:
    "Check exact membership in a caller-provided literal token enumeration; no case folding, aliases or authoritative vocabulary.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
