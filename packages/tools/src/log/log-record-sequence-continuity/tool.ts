import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.logs(i.recordsJson);
  return H.finish({
    transitions: r.slice(1).map((v, j) => ({
      index: j + 1,
      expected: r[j].sequence + 1,
      observed: v.sequence,
      delta: v.sequence - r[j].sequence - 1,
    })),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"id": "a", "time": 1, "source": "s", "level": "info", "message": "x", "sequence": 1}, {"id": "b", "time": 3, "source": "s", "level": "info", "message": "x", "sequence": 3}]',
  },
  output: {
    result: { transitions: [{ index: 1, expected: 2, observed: 3, delta: 1 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/log-record-sequence-continuity",
  title: "Log Record Sequence Continuity Check",
  description:
    "Audit consecutive explicit non-wrapping log sequence numbers, retaining signed duplicate/reordering evidence; no modulo or missing-event certainty.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
