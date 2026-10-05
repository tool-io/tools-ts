import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiryDate: string;
  readonly appointmentDate: string;
};
export type Output = {
  readonly expiredBeforeAppointment: boolean;
  readonly daysRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDate: { type: "string", maxLength: 8192 },
    appointmentDate: { type: "string", maxLength: 8192 },
  },
  required: ["expiryDate", "appointmentDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiredBeforeAppointment: { type: "boolean" },
    daysRemaining: { type: "integer" },
  },
  required: ["expiredBeforeAppointment", "daysRemaining"],
} as const;
/** Compare a supplied housing-assistance document's inclusive expiry date with an appointment date without deciding document acceptability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiryDate, appointmentDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    const e = namedDate(expiryDate, "expiryDate").getTime(),
      a = namedDate(appointmentDate, "appointmentDate").getTime();
    return {
      expiredBeforeAppointment: a > e,
      daysRemaining: (e - a) / 86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expiryDate: "2026-11-10", appointmentDate: "2026-11-01" },
  output: { expiredBeforeAppointment: false, daysRemaining: 9 },
} satisfies ToolExample<Input, Output>;
export const housingAssistanceDocumentExpiryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/housing-assistance-document-expiry",
    title: "Housing Assistance Document Expiry Tool",
    description:
      "Compare a supplied housing-assistance document's inclusive expiry date with an appointment date without deciding document acceptability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryDate: { type: "string", maxLength: 8192 },
        appointmentDate: { type: "string", maxLength: 8192 },
      },
      required: ["expiryDate", "appointmentDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiredBeforeAppointment: { type: "boolean" },
        daysRemaining: { type: "integer" },
      },
      required: ["expiredBeforeAppointment", "daysRemaining"],
    },
    ports: {
      inputs: [
        {
          id: "expiryDate",
          label: "Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "appointmentDate",
          label: "Appointment Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "expiredBeforeAppointment",
          label: "Expired Before Appointment",
          valueType: { type: "boolean" },
        },
        {
          id: "daysRemaining",
          label: "Days Remaining",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = housingAssistanceDocumentExpiryTool.execute;
export default housingAssistanceDocumentExpiryTool;
