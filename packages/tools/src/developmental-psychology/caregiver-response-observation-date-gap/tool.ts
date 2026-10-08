import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDate: string;
  readonly responseDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDate: { type: "string", maxLength: 8192 },
    responseDate: { type: "string", maxLength: 8192 },
  },
  required: ["observationDate", "responseDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure signed calendar days between supplied child-study observation and caregiver-response dates without interpreting recall accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDate, responseDate } = request;
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
    return {
      signedCalendarDays:
        (namedDate(responseDate, "responseDate").getTime() -
          namedDate(observationDate, "observationDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationDate: "2026-10-28", responseDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const caregiverResponseObservationDateGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/caregiver-response-observation-date-gap",
      title: "Caregiver Response Observation Date Gap Tool",
      description:
        "Measure signed calendar days between supplied child-study observation and caregiver-response dates without interpreting recall accuracy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationDate: { type: "string", maxLength: 8192 },
          responseDate: { type: "string", maxLength: 8192 },
        },
        required: ["observationDate", "responseDate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedCalendarDays: { type: "integer" } },
        required: ["signedCalendarDays"],
      },
      ports: {
        inputs: [
          {
            id: "observationDate",
            label: "Observation Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "responseDate",
            label: "Response Date",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "signedCalendarDays",
            label: "Signed Calendar Days",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = caregiverResponseObservationDateGapTool.execute;
export default caregiverResponseObservationDateGapTool;
