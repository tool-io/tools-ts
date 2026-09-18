import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  headersJson: string;
  names: readonly string[];
  replacement: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "headersJson", label: "headersJson", kind: "string" },
  { id: "names", label: "names", kind: "stringList" },
  { id: "replacement", label: "replacement", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.headerPairs(i.headersJson);
  H.headerPairs(JSON.stringify([{ name: "x", value: i.replacement }]));
  i.names.forEach((s) => H.check(H.token(s)));
  return H.finish({
    headers: r.map((v) => ({
      ...v,
      value: i.names.map((x) => x.toLowerCase()).includes(v.name.toLowerCase())
        ? i.replacement
        : v.value,
    })),
  });
};
export const example = {
  input: {
    headersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
    names: ["x-a"],
    replacement: "[redacted]",
  },
  output: {
    result: {
      headers: [
        { name: "X-A", value: "[redacted]" },
        { name: "x-a", value: "[redacted]" },
        { name: "Set-Cookie", value: "a=1" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-occurrence-value-redaction",
  title: "HTTP Header Occurrence Value Redaction",
  description:
    "Redact complete supplied HTTP field values by explicit case-insensitive names without modifying occurrence order; not a guarantee that sensitive data is absent elsewhere.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
