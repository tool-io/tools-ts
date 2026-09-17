import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    families: H.lexicalSplit(i.text, ",").map((v) => {
      const s = v.text.trim();
      H.check(s.length > 0);
      if (s.startsWith(String.fromCharCode(34))) {
        const x = H.json(s);
        return H.str(x);
      }
      const identifier =
        "(?:--[A-Za-z0-9_-]*|-[A-Za-z_][A-Za-z0-9_-]*|[A-Za-z_][A-Za-z0-9_-]*)";
      H.check(new RegExp(`^${identifier}(?: +${identifier})*$`).test(s));
      return s;
    }),
  });
};
export const example = {
  input: { text: '"A B", serif' },
  output: { result: { families: ["A B", "serif"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/font-family-list-parser",
  title: "CSS Font Family List Parser",
  description:
    "Parse a restricted CSS font-family list of JSON-double-quoted strings or valid unescaped ASCII identifier sequences; CSS escape and single-quoted syntax is intentionally rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
