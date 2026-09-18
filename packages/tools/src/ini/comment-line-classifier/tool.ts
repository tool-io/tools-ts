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
  const trimmed = i.line.replace(/^[ \t]*/, "");
  return H.finish({
    comment: trimmed.startsWith(";") || trimmed.startsWith("#"),
    marker: trimmed.startsWith(";")
      ? ";"
      : trimmed.startsWith("#")
        ? "#"
        : null,
  });
};
export const example = {
  input: { line: "  # x" },
  output: { result: { comment: true, marker: "#" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ini/comment-line-classifier",
  title: "INI Comment Line Classifier",
  description:
    "Classify whole-line comments in a restricted INI dialect using first non-SP/HTAB semicolon or hash; not inline comment stripping or quote handling.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
