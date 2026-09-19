import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ parentsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  return H.finish({
    duplicates: H.duplicates(p, (v) => v.id),
    missing: p.flatMap((v, index) =>
      v.parent !== null && !p.some((x) => x.id === v.parent)
        ? [{ index, parent: v.parent }]
        : [],
    ),
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
  },
  output: { result: { duplicates: [], missing: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-identity-audit",
  title: "Parent Forest Identity Audit",
  description:
    "Audit parent-record duplicate identities and missing references without pretending incomplete or ambiguous data is a forest.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
