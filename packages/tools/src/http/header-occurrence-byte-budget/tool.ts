import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ headersJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "headersJson", label: "headersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.headerPairs(i.headersJson);
  return H.finish({
    lines: r.map((v) => v.name.length + 2 + v.value.length + 2),
    total: r.reduce((s, v) => s + v.name.length + v.value.length + 4, 2),
  });
};
export const example = {
  input: {
    headersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
  },
  output: { result: { lines: [10, 10, 17], total: 39 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-occurrence-byte-budget",
  title: "HTTP Header Occurrence Byte Budget",
  description:
    "Budget HTTP/1 field section octets under literal name-colon-space-value-CRLF serialization plus final CRLF; Latin-1 octets, not HTTP/2 compression or UTF-8.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
