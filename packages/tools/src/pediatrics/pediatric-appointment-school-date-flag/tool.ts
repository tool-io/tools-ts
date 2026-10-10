import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly appointmentDate: string;
  readonly suppliedSchoolDates: readonly string[];
};
export type Output = { readonly listedSchoolDate: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appointmentDate: { type: "string", maxLength: 8192 },
    suppliedSchoolDates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["appointmentDate", "suppliedSchoolDates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { listedSchoolDate: { type: "boolean" } },
  required: ["listedSchoolDate"],
} as const;
/** Check an explicit appointment date against a caller-supplied school-date list without inferring calendars or attendance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { appointmentDate, suppliedSchoolDates } = request;
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
    namedDate(appointmentDate, "appointmentDate");
    suppliedSchoolDates.forEach((v) => namedDate(v, "suppliedSchoolDates"));
    return { listedSchoolDate: suppliedSchoolDates.includes(appointmentDate) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    appointmentDate: "2026-11-02",
    suppliedSchoolDates: ["2026-11-02", "2026-11-03"],
  },
  output: { listedSchoolDate: true },
} satisfies ToolExample<Input, Output>;
export const pediatricAppointmentSchoolDateFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pediatrics", "health and medicine"],
      keywords: ["pediatrics", "health and medicine"],
    },
    id: "pediatrics/pediatric-appointment-school-date-flag",
    title: "Pediatric Appointment School Date Flag",
    description:
      "Check an explicit appointment date against a caller-supplied school-date list without inferring calendars or attendance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appointmentDate: { type: "string", maxLength: 8192 },
        suppliedSchoolDates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["appointmentDate", "suppliedSchoolDates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { listedSchoolDate: { type: "boolean" } },
      required: ["listedSchoolDate"],
    },
    ports: {
      inputs: [
        {
          id: "appointmentDate",
          label: "Appointment Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSchoolDates",
          label: "Supplied School Dates",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "listedSchoolDate",
          label: "Listed School Date",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pediatricAppointmentSchoolDateFlagTool.execute;
export default pediatricAppointmentSchoolDateFlagTool;
