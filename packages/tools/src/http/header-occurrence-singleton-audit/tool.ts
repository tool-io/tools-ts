import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  headersJson: string;
  singletonNames: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "headersJson", label: "headersJson", kind: "string" },
  { id: "singletonNames", label: "singletonNames", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.headerPairs(i.headersJson);
  i.singletonNames.forEach((s) => H.check(H.token(s)));
  return H.finish({
    violations: H.groups(r, (v) => v.name.toLowerCase()).filter(
      (g) =>
        i.singletonNames.map((x) => x.toLowerCase()).includes(g.key) &&
        g.indexes.length > 1,
    ),
  });
};
export const example = {
  input: {
    headersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
    singletonNames: ["X-A"],
  },
  output: { result: { violations: [{ key: "x-a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-occurrence-singleton-audit",
  title: "HTTP Header Singleton Occurrence Audit",
  description:
    "Audit repeated HTTP fields only for caller-declared singleton names; does not invent a universal singleton table or enforce request-smuggling policy.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
