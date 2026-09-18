import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  boundary: string;
  headerLines: readonly string[];
  payloadBytes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "boundary", label: "boundary", kind: "string" },
  { id: "headerLines", label: "headerLines", kind: "stringList" },
  { id: "payloadBytes", label: "payloadBytes", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.boundary(i.boundary);
  H.int(i.payloadBytes, 0, 1e9);
  i.headerLines.forEach((s) =>
    H.check(
      !/[\r\n]/.test(s) && s.split("").every((c) => c.charCodeAt(0) <= 255),
    ),
  );
  const openingBytes = i.boundary.length + 4,
    headerBytes = i.headerLines.reduce((s, v) => s + v.length + 2, 2);
  return H.finish({
    openingBytes,
    headerBytes,
    payloadBytes: i.payloadBytes,
    total: openingBytes + headerBytes + i.payloadBytes + 2,
  });
};
export const example = {
  input: { boundary: "abc", headerLines: ["X: y"], payloadBytes: 10 },
  output: {
    result: { openingBytes: 7, headerBytes: 8, payloadBytes: 10, total: 27 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/multipart-part-envelope-byte-budget",
  title: "Multipart Part Envelope Byte Budget",
  description:
    "Budget one MIME part as opening delimiter, supplied Latin-1 header lines plus blank line, explicit payload byte count and trailing CRLF; excludes final closing delimiter.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
