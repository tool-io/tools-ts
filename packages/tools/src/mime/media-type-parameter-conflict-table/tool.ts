import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parametersJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parametersJson", label: "parametersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.parameterRecords(i.parametersJson);
  return H.finish({
    conflicts: H.groups(r, (v) => v.name).filter(
      (g) => H.unique(g.indexes.map((j) => r[j].value)).length > 1,
    ),
  });
};
export const example = {
  input: {
    parametersJson: '[{"name":"A","value":"x"},{"name":"a","value":"y"}]',
  },
  output: { result: { conflicts: [{ key: "a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/media-type-parameter-conflict-table",
  title: "Media Type Parameter Conflict Table",
  description:
    "Audit conflicting decoded MIME parameter values under case-insensitive names and case-sensitive literal values; no registered-parameter equivalence inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
