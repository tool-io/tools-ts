import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly appointmentMinutes: number;
  readonly recordedCleaningMinutes: number;
  readonly otherTaskMinutes: number;
};
export type Output = { readonly bufferMinutes: number; readonly fits: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appointmentMinutes: { type: "number", minimum: 0 },
    recordedCleaningMinutes: { type: "number", minimum: 0 },
    otherTaskMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "appointmentMinutes",
    "recordedCleaningMinutes",
    "otherTaskMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bufferMinutes: { type: "number" }, fits: { type: "boolean" } },
  required: ["bufferMinutes", "fits"],
} as const;
/** Balance explicitly nonoverlapping recorded appointment activities against a supplied duration without recommending clinical procedure timing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { appointmentMinutes, recordedCleaningMinutes, otherTaskMinutes } =
    request;
  const compute = (): Output => {
    H.domain(
      appointmentMinutes >= 0 &&
        recordedCleaningMinutes >= 0 &&
        otherTaskMinutes >= 0,
      "appointmentMinutes",
    );
    return {
      bufferMinutes:
        appointmentMinutes - recordedCleaningMinutes - otherTaskMinutes,
      fits: recordedCleaningMinutes + otherTaskMinutes <= appointmentMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    appointmentMinutes: 60,
    recordedCleaningMinutes: 40,
    otherTaskMinutes: 10,
  },
  output: { bufferMinutes: 10, fits: true },
} satisfies ToolExample<Input, Output>;
export const hygieneAppointmentCleaningBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/hygiene-appointment-cleaning-buffer",
    title: "Hygiene Appointment Cleaning Buffer",
    description:
      "Balance explicitly nonoverlapping recorded appointment activities against a supplied duration without recommending clinical procedure timing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appointmentMinutes: { type: "number", minimum: 0 },
        recordedCleaningMinutes: { type: "number", minimum: 0 },
        otherTaskMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "appointmentMinutes",
        "recordedCleaningMinutes",
        "otherTaskMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bufferMinutes: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["bufferMinutes", "fits"],
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
          id: "recordedCleaningMinutes",
          label: "Recorded Cleaning Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherTaskMinutes",
          label: "Other Task Minutes",
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
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = hygieneAppointmentCleaningBufferTool.execute;
export default hygieneAppointmentCleaningBufferTool;
