import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly appointmentId: string;
  readonly attended: boolean;
  readonly cancelled: boolean;
  readonly notYetOccurred: boolean;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appointmentId: { type: "string", maxLength: 8192, minLength: 1 },
    attended: { type: "boolean" },
    cancelled: { type: "boolean" },
    notYetOccurred: { type: "boolean" },
  },
  required: ["appointmentId", "attended", "cancelled", "notYetOccurred"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Encode explicit appointment attendance, cancellation, and future-event flags without inferring reasons for nonattendance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { appointmentId, attended, cancelled, notYetOccurred } = request;
  const compute = (): Output => {
    H.domain(appointmentId.length > 0, "appointmentId");
    H.domain(
      [attended, cancelled, notYetOccurred].filter(Boolean).length <= 1,
      "attended",
    );
    return {
      status: notYetOccurred
        ? "not-yet-occurred"
        : cancelled
          ? "cancelled"
          : attended
            ? "attended"
            : "not-attended",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    appointmentId: "A17",
    attended: true,
    cancelled: false,
    notYetOccurred: false,
  },
  output: { status: "attended" },
} satisfies ToolExample<Input, Output>;
export const psychiatryAppointmentAttendanceCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["psychiatry", "health and medicine"],
        keywords: ["psychiatry", "health and medicine"],
      },
      id: "psychiatry/psychiatry-appointment-attendance-code",
      title: "Psychiatry Appointment Attendance Code",
      description:
        "Encode explicit appointment attendance, cancellation, and future-event flags without inferring reasons for nonattendance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          appointmentId: { type: "string", maxLength: 8192, minLength: 1 },
          attended: { type: "boolean" },
          cancelled: { type: "boolean" },
          notYetOccurred: { type: "boolean" },
        },
        required: ["appointmentId", "attended", "cancelled", "notYetOccurred"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { status: { type: "string", maxLength: 8192 } },
        required: ["status"],
      },
      ports: {
        inputs: [
          {
            id: "appointmentId",
            label: "Appointment Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "attended",
            label: "Attended",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "cancelled",
            label: "Cancelled",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "notYetOccurred",
            label: "Not Yet Occurred",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "status", label: "Status", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = psychiatryAppointmentAttendanceCodeTool.execute;
export default psychiatryAppointmentAttendanceCodeTool;
