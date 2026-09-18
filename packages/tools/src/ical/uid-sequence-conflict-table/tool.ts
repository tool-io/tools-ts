import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ eventsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eventsJson", label: "eventsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.eventsJson).map((v) => ({
    uid: H.str(v.uid),
    sequence: H.int(H.num(v.sequence), 0, 2147483647),
    payload: H.str(v.payload),
  }));
  return H.finish({
    conflicts: H.groups(r, (v) => JSON.stringify([v.uid, v.sequence])).filter(
      (g) => H.unique(g.indexes.map((j) => r[j].payload)).length > 1,
    ),
  });
};
export const example = {
  input: {
    eventsJson:
      '[{"uid":"x","sequence":1,"payload":"a"},{"uid":"x","sequence":1,"payload":"b"}]',
  },
  output: { result: { conflicts: [{ key: '["x",1]', indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/uid-sequence-conflict-table",
  title: "iCalendar UID Sequence Conflict Table",
  description:
    "Audit distinct supplied payloads for equal UID/SEQUENCE observations; no calendar merge, latest revision or recurrence resolution claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
