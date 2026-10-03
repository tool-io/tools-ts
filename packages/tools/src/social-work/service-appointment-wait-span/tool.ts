import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedAt: number;
  readonly appointmentAt: number;
};
export type Output = {
  readonly wait: number;
  readonly appointmentPrecedesRequest: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedAt: { type: "number" },
    appointmentAt: { type: "number" },
  },
  required: ["requestedAt", "appointmentAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wait: { type: "number" },
    appointmentPrecedesRequest: { type: "boolean" },
  },
  required: ["wait", "appointmentPrecedesRequest"],
} as const;
/** Calculate service appointment wait span from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedAt, appointmentAt } = request;
  const compute = (): Output => {
    return {
      wait: appointmentAt - requestedAt,
      appointmentPrecedesRequest: appointmentAt < requestedAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedAt: 10, appointmentAt: 25 },
  output: { wait: 15, appointmentPrecedesRequest: false },
} satisfies ToolExample<Input, Output>;
export const serviceAppointmentWaitSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/service-appointment-wait-span",
    title: "Service Appointment Wait Span Tool",
    description:
      "Calculate service appointment wait span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedAt: { type: "number" },
        appointmentAt: { type: "number" },
      },
      required: ["requestedAt", "appointmentAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wait: { type: "number" },
        appointmentPrecedesRequest: { type: "boolean" },
      },
      required: ["wait", "appointmentPrecedesRequest"],
    },
    ports: {
      inputs: [
        {
          id: "requestedAt",
          label: "Requested At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "appointmentAt",
          label: "Appointment At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "wait", label: "Wait", valueType: { type: "number" } },
        {
          id: "appointmentPrecedesRequest",
          label: "Appointment Precedes Request",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = serviceAppointmentWaitSpanTool.execute;
export default serviceAppointmentWaitSpanTool;
