import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  appointmentDate: string;
  appointmentMinuteOfDay: number;
  offsetMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "appointmentDate", label: "Appointment date", kind: "string" },
  {
    id: "appointmentMinuteOfDay",
    label: "Appointment minute of day",
    kind: "integer",
  },
  { id: "offsetMinutes", label: "Offset minutes", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.appointmentMinuteOfDay, 0, 1439);
  H.int(i.offsetMinutes, 0, 525600);
  const total = i.appointmentMinuteOfDay - i.offsetMinutes;
  return H.finish({
    reminderDate: H.addDays(i.appointmentDate, Math.floor(total / 1440)),
    reminderMinuteOfDay: H.mod(total, 1440),
  });
};
export const example = {
  input: {
    appointmentDate: "2024-03-01",
    appointmentMinuteOfDay: 30,
    offsetMinutes: 60,
  },
  output: { result: { reminderDate: "2024-02-29", reminderMinuteOfDay: 1410 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "health/appointment-rem-in-der-fixed-offset",
  title: "Health: Appointment Rem In Der Fixed Offset Tool",
  description:
    "Compute a local appointment reminder by a fixed earlier-minute offset on a civil-date/minute pair; no alarm scheduling, DST or timezone resolution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reminderDate: { type: "string" },
          reminderMinuteOfDay: { type: "number" },
        },
        required: ["reminderDate", "reminderMinuteOfDay"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
