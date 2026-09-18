import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ payload: string; boundary: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "payload", label: "payload", kind: "string" },
  { id: "boundary", label: "boundary", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.boundary(i.boundary);
  const r: { start: number; end: number; kind: string }[] = [];
  let offset = 0;
  for (const line of i.payload.split("\r\n")) {
    const kind = H.boundaryKind(line, i.boundary);
    if (kind !== "none")
      r.push({ start: offset, end: offset + line.length, kind });
    offset += line.length + 2;
  }
  return H.finish({ collisions: r });
};
export const example = {
  input: { payload: "x\r\n--abc\r\ny", boundary: "abc" },
  output: { result: { collisions: [{ start: 3, end: 8, kind: "open" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/multipart-boundary-payload-collision",
  title: "Multipart Boundary Payload Collision Audit",
  description:
    "Audit complete multipart delimiter-looking lines at the start or after CRLF in an explicit payload; prefix-only non-delimiter matches do not count, no byte encoding inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
