import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ literal: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "literal", kind: "string", label: "literal" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    pattern: "^(?:" + H.regexLiteral(i.literal) + ")(?![\\s\\S])",
  });
};
export const example = {
  input: { literal: "a.b" },
  output: { result: { pattern: "^(?:a\\.b)(?![\\s\\S])" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/regex-literal-full-token-pattern",
  title: "Literal Full Token Pattern Builder",
  description:
    "Build a literal full-string ECMAScript pattern with a strict end assertion, avoiding dollar-anchor final-newline acceptance; assumes no multiline flag.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
