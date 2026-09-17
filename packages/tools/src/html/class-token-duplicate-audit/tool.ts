import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ classes: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "classes", kind: "string", label: "classes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const tokens = H.classTokens(i.classes);
  return H.finish({ tokens, duplicates: H.duplicates(tokens, (x) => x) });
};
export const example = {
  input: { classes: "a\tb a  " },
  output: {
    result: {
      tokens: ["a", "b", "a"],
      duplicates: [{ key: "a", indexes: [0, 2] }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/class-token-duplicate-audit",
  title: "HTML Class Token Duplicate Audit",
  description:
    "Audit class token duplicates using HTML ASCII whitespace splitting and exact case-sensitive token identity; does not parse selectors or CSS escapes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
