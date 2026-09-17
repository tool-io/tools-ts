import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ directivesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "directivesJson", label: "directivesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.directives(i.directivesJson);
  return H.finish({
    conflicts: H.groups(r, (v) => v.name).filter(
      (g) =>
        H.unique(g.indexes.map((j) => JSON.stringify(r[j].value))).length > 1,
    ),
  });
};
export const example = {
  input: {
    directivesJson:
      '[{"name":"max-age","value":"5"},{"name":"MAX-AGE","value":"6"}]',
  },
  output: { result: { conflicts: [{ key: "max-age", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cache/directive-occurrence-conflict-audit",
  title: "Cache Directive Occurrence Conflict Audit",
  description:
    "Audit conflicting explicit Cache-Control directive occurrences under case-insensitive names, distinguishing bare/null from empty values; no conflict-resolution policy.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
