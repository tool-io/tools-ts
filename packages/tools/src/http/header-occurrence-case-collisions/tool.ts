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
    collisions: H.groups(r, (v) => v.name.toLowerCase()).filter(
      (g) => H.unique(g.indexes.map((j) => r[j].name)).length > 1,
    ),
  });
};
export const example = {
  input: {
    headersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
  },
  output: { result: { collisions: [{ key: "x-a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-occurrence-case-collisions",
  title: "HTTP Header Occurrence Case Collisions",
  description:
    "Audit HTTP field-name spelling collisions separately from repeated identical spellings; validates token names and Latin-1 field-value octets.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
