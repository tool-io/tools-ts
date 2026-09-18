import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ section: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "section", label: "section", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.iniName(i.section);
  return H.finish({ line: "[" + i.section + "]" });
};
export const example = {
  input: { section: "main" },
  output: { result: { line: "[main]" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/section-name-line-formatter",
  title: "INI Section Name Line Formatter",
  description:
    "Format a literal nonempty trimmed INI section name for the restricted bracketed dialect; no escaping, nesting or case normalization.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
