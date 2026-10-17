import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ line: string; boundary: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "line", label: "line", kind: "string" },
  { id: "boundary", label: "boundary", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(!/[\r\n]/.test(i.line));
  return H.finish({ kind: H.boundaryKind(i.line, i.boundary) });
};
export const example = {
  input: { line: "--abc--\t", boundary: "abc" },
  output: { result: { kind: "close" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Multipart Delimiter Line Classifier", "MIME", "encoding"],
    collections: ["encode-decode"],
    fields: ["MIME", "encoding"],
    keywords: ["MIME", "encoding"],
  },
  id: "mime/multipart-delimiter-line-classifier",
  title: "Multipart Delimiter Line Classifier",
  description:
    "Classify a multipart delimiter line without its CRLF, recognizing optional closing double dash and trailing SP/HTAB only; no prefix false positives.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { kind: { type: "string" } },
        required: ["kind"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
