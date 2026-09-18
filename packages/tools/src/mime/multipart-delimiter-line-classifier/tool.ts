import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ line: string; boundary: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "line", kind: "string" },
  { id: "boundary", label: "boundary", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(!/[\r\n]/.test(i.line));
  return H.finish({ kind: H.boundaryKind(i.line, i.boundary) });
};
export const example = {
  input: { line: "--abc--\t", boundary: "abc" },
  output: { result: { kind: "close" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/multipart-delimiter-line-classifier",
  title: "Multipart Delimiter Line Classifier",
  description:
    "Classify a multipart delimiter line without its CRLF, recognizing optional closing double dash and trailing SP/HTAB only; no prefix false positives.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
