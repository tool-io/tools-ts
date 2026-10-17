import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ boundary: string; closing: boolean }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "boundary", label: "boundary", kind: "string" },
  { id: "closing", label: "closing", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.boundary(i.boundary);
  return H.finish({
    line: "--" + i.boundary + (i.closing ? "--" : "") + "\r\n",
  });
};
export const example = {
  input: { boundary: "abc", closing: true },
  output: { result: { line: "--abc--\r\n" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Multipart Boundary Delimiter Formatter", "MIME", "encoding"],
    collections: ["encode-decode"],
    fields: ["MIME", "encoding"],
    keywords: ["MIME", "encoding"],
  },
  id: "mime/multipart-boundary-delimiter-formatter",
  title: "Multipart Boundary Delimiter Formatter",
  description:
    "Format one RFC 2046 multipart delimiter line with explicit closing policy and CRLF; validates the supplied boundary, does not generate a collision-safe boundary.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { line: { type: "string" } },
        required: ["line"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
