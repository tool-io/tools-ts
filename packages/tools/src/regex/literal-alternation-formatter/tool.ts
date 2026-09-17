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
  return H.finish({
    pattern: i.literals.length
      ? "(?:" + i.literals.map(H.regexLiteral).join("|") + ")"
      : "(?!)",
  });
};
export const example = {
  input: { literals: ["a.b", "x|y"] },
  output: { result: { pattern: "(?:a\\.b|x\\|y)" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/literal-alternation-formatter",
  title: "Literal Alternation Formatter",
  description:
    "Build a noncapturing literal alternation with regex metacharacters escaped; empty bank produces a never-matching pattern.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
