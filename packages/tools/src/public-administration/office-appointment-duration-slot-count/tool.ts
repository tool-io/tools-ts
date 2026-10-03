import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openMinutes: number;
  readonly breakMinutes: number;
  readonly appointmentMinutes: number;
  readonly bufferMinutes: number;
};
export type Output = { readonly slots: number; readonly unusedMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openMinutes: { type: "number" },
    breakMinutes: { type: "number", minimum: 0 },
    appointmentMinutes: { type: "number", exclusiveMinimum: 0 },
    bufferMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "openMinutes",
    "breakMinutes",
    "appointmentMinutes",
    "bufferMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slots: { type: "integer" }, unusedMinutes: { type: "number" } },
  required: ["slots", "unusedMinutes"],
} as const;
/** Aggregate full appointment-plus-buffer slots; break fragmentation and final buffer removal are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openMinutes, breakMinutes, appointmentMinutes, bufferMinutes } =
    request;
  const compute = (): Output => {
    H.domain(
      breakMinutes >= 0 &&
        openMinutes >= breakMinutes &&
        appointmentMinutes > 0 &&
        bufferMinutes >= 0,
    );
    return {
      slots: Math.floor(
        (openMinutes - breakMinutes) / (appointmentMinutes + bufferMinutes),
      ),
      unusedMinutes:
        (openMinutes - breakMinutes) % (appointmentMinutes + bufferMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openMinutes: 480,
    breakMinutes: 60,
    appointmentMinutes: 20,
    bufferMinutes: 10,
  },
  output: { slots: 14, unusedMinutes: 0 },
} satisfies ToolExample<Input, Output>;
export const officeAppointmentDurationSlotCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/office-appointment-duration-slot-count",
    title: "Office Appointment Duration Slot Count Tool",
    description:
      "Aggregate full appointment-plus-buffer slots; break fragmentation and final buffer removal are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openMinutes: { type: "number" },
        breakMinutes: { type: "number", minimum: 0 },
        appointmentMinutes: { type: "number", exclusiveMinimum: 0 },
        bufferMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "openMinutes",
        "breakMinutes",
        "appointmentMinutes",
        "bufferMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slots: { type: "integer" },
        unusedMinutes: { type: "number" },
      },
      required: ["slots", "unusedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "openMinutes",
          label: "Open Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breakMinutes",
          label: "Break Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "appointmentMinutes",
          label: "Appointment Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bufferMinutes",
          label: "Buffer Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slots", label: "Slots", valueType: { type: "integer" } },
        {
          id: "unusedMinutes",
          label: "Unused Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = officeAppointmentDurationSlotCountTool.execute;
export default officeAppointmentDurationSlotCountTool;
