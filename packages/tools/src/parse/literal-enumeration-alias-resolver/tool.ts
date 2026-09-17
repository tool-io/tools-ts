import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  token: string;
  aliasesJson: string;
  allowed: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", kind: "string", label: "token" },
  { id: "aliasesJson", kind: "string", label: "aliasesJson" },
  { id: "allowed", kind: "stringList", label: "allowed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.resolveAlias(H.aliases(i.aliasesJson), i.token);
  return H.finish({
    ...r,
    allowed: r.terminal !== null && i.allowed.includes(r.terminal),
  });
};
export const example = {
  input: {
    token: "a",
    aliasesJson: '[{"name":"a","target":"A"}]',
    allowed: ["A"],
  },
  output: {
    result: { path: ["a", "A"], terminal: "A", cycle: false, allowed: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/literal-enumeration-alias-resolver",
  title: "Literal Enumeration Alias Resolver",
  description:
    "Resolve caller-defined enumeration aliases with cycle/path evidence and check the terminal against an explicit allowed bank.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
