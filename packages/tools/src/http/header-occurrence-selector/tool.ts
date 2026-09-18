import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ headersJson: string; names: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "headersJson", label: "headersJson", kind: "string" },
  { id: "names", label: "names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.headerPairs(i.headersJson);
  i.names.forEach((s) => H.check(H.token(s)));
  return H.finish({
    headers: r.flatMap((v, index) =>
      i.names.map((x) => x.toLowerCase()).includes(v.name.toLowerCase())
        ? [{ ...v, index }]
        : [],
    ),
  });
};
export const example = {
  input: {
    headersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
    names: ["set-cookie"],
  },
  output: {
    result: { headers: [{ name: "Set-Cookie", value: "a=1", index: 2 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-occurrence-selector",
  title: "HTTP Header Occurrence Selector",
  description:
    "Select all explicit HTTP header occurrences by a token-name bank under case-insensitive lookup, retaining source indexes and original spellings.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
