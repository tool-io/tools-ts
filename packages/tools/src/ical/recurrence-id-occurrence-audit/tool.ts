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
    recurrenceId: H.str(v.recurrenceId),
  }));
  return H.finish({
    duplicates: H.duplicates(r, (v) => JSON.stringify([v.uid, v.recurrenceId])),
  });
};
export const example = {
  input: {
    eventsJson:
      '[{"uid":"x","recurrenceId":"20260101"},{"uid":"x","recurrenceId":"20260101"}]',
  },
  output: {
    result: { duplicates: [{ key: '["x","20260101"]', indexes: [0, 1] }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/recurrence-id-occurrence-audit",
  title: "iCalendar Recurrence ID Occurrence Audit",
  description:
    "Audit repeated explicit UID/RECURRENCE-ID identity pairs without interpreting recurrence rules, time zones or replacement precedence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
