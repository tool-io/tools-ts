import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ literals: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "literals", kind: "stringList", label: "literals" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  let prefix = i.literals[0] ?? "";
  for (const s of i.literals)
    while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1);
  const suffixes = i.literals.map((s) => s.slice(prefix.length));
  return H.finish({
    prefix,
    suffixes,
    pattern: i.literals.length
      ? H.regexLiteral(prefix) +
        "(?:" +
        suffixes.map(H.regexLiteral).join("|") +
        ")"
      : "(?!)",
  });
};
export const example = {
  input: { literals: ["abc", "abd"] },
  output: {
    result: { prefix: "ab", suffixes: ["c", "d"], pattern: "ab(?:c|d)" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/literal-pattern-prefix-factoring",
  title: "Literal Pattern Prefix Factoring",
  description:
    "Factor the common UTF-16 prefix from literal alternatives and produce an escaped noncapturing pattern; no general regex algebra.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
