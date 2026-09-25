import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ line: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "Line", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    softBreak: i.line.endsWith("=\r\n"),
    content: i.line.endsWith("=\r\n") ? i.line.slice(0, -3) : i.line,
  });
};
export const example = {
  input: { line: "abc=\r\n" },
  output: { result: { softBreak: true, content: "abc" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/quoted-printable-soft-break-line",
  title: "Decoding: Quoted Printable Soft Break Line Tool",
  description:
    "Recognize and remove only a terminal RFC2045 quoted-printable soft break =CRLF from one line; no permissive LF-only continuation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          content: { type: "string" },
          softBreak: { type: "boolean" },
        },
        required: ["content", "softBreak"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
