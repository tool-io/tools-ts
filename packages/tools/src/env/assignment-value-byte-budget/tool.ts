import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ assignmentsJson: string; budget: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "assignmentsJson", label: "assignmentsJson", kind: "string" },
  { id: "budget", label: "budget", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.budget, 0, 1e9);
  const r = H.assignments(i.assignmentsJson);
  return H.finish({
    records: r.map((v) => ({
      name: v.name,
      bytes: H.utf8(v.value),
      withinBudget: H.utf8(v.value) <= i.budget,
    })),
  });
};
export const example = {
  input: { assignmentsJson: '[{"name":"A","value":"\u00e9"}]', budget: 1 },
  output: {
    result: { records: [{ name: "A", bytes: 2, withinBudget: false }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "env/assignment-value-byte-budget",
  title: "Environment Assignment Value Byte Budget",
  description:
    "Audit explicit environment values against a supplied UTF-8 byte budget, excluding variable names, equals, NUL terminators and OS argv/env aggregate limits.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
