import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly appointmentMinutes: number;
  readonly serviceMinutes: number;
};
export type Output = { readonly bufferMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appointmentMinutes: { type: "number", minimum: 0 },
    serviceMinutes: { type: "number", minimum: 0 },
  },
  required: ["appointmentMinutes", "serviceMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bufferMinutes: { type: "number" } },
  required: ["bufferMinutes"],
} as const;
/** Subtract supplied service time from the appointment slot, preserving negative overruns. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { appointmentMinutes, serviceMinutes } = request;
  const compute = (): Output => {
    H.domain(appointmentMinutes >= 0, "appointmentMinutes");
    H.domain(serviceMinutes >= 0, "serviceMinutes");
    return { bufferMinutes: appointmentMinutes - serviceMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { appointmentMinutes: 30, serviceMinutes: 22 },
  output: { bufferMinutes: 8 },
} satisfies ToolExample<Input, Output>;
export const officeAppointmentServiceBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/office-appointment-service-buffer",
    title: "Office Appointment Service Buffer",
    description:
      "Subtract supplied service time from the appointment slot, preserving negative overruns.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appointmentMinutes: { type: "number", minimum: 0 },
        serviceMinutes: { type: "number", minimum: 0 },
      },
      required: ["appointmentMinutes", "serviceMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bufferMinutes: { type: "number" } },
      required: ["bufferMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "appointmentMinutes",
          label: "Appointment Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "serviceMinutes",
          label: "Service Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bufferMinutes",
          label: "Buffer Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = officeAppointmentServiceBufferTool.execute;
export default officeAppointmentServiceBufferTool;
