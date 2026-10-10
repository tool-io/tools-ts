import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedSlotMinutes: number;
  readonly actualSlotMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedSlotMinutes: { type: "number" },
    actualSlotMinutes: { type: "number" },
  },
  required: ["plannedSlotMinutes", "actualSlotMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit planned agenda-slot duration from actual duration, preserving an underrun. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedSlotMinutes, actualSlotMinutes } = request;
  const compute = (): Output => {
    return { signedGap: actualSlotMinutes - plannedSlotMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedSlotMinutes: 12, actualSlotMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const meetingAgendaSlotOverrunTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/meeting-agenda-slot-overrun",
    title: "Meeting Agenda Slot Overrun",
    description:
      "Subtract explicit planned agenda-slot duration from actual duration, preserving an underrun.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedSlotMinutes: { type: "number" },
        actualSlotMinutes: { type: "number" },
      },
      required: ["plannedSlotMinutes", "actualSlotMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "plannedSlotMinutes",
          label: "Planned Slot Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualSlotMinutes",
          label: "Actual Slot Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = meetingAgendaSlotOverrunTool.execute;
export default meetingAgendaSlotOverrunTool;
