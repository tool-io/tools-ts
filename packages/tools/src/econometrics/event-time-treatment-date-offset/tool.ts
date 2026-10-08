import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDate: string;
  readonly treatmentDate: string;
};
export type Output = { readonly eventDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDate: { type: "string", maxLength: 8192 },
    treatmentDate: { type: "string", maxLength: 8192 },
  },
  required: ["observationDate", "treatmentDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eventDay: { type: "integer" } },
  required: ["eventDay"],
} as const;
/** Reference an observation date to an explicitly supplied treatment date in signed calendar days without estimating treatment effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDate, treatmentDate } = request;
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
      eventDay:
        (namedDate(observationDate, "observationDate").getTime() -
          namedDate(treatmentDate, "treatmentDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationDate: "2026-11-05", treatmentDate: "2026-11-01" },
  output: { eventDay: 4 },
} satisfies ToolExample<Input, Output>;
export const eventTimeTreatmentDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["econometrics", "economics"],
      keywords: ["econometrics", "economics"],
    },
    id: "econometrics/event-time-treatment-date-offset",
    title: "Event Time Treatment Date Offset",
    description:
      "Reference an observation date to an explicitly supplied treatment date in signed calendar days without estimating treatment effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationDate: { type: "string", maxLength: 8192 },
        treatmentDate: { type: "string", maxLength: 8192 },
      },
      required: ["observationDate", "treatmentDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { eventDay: { type: "integer" } },
      required: ["eventDay"],
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
          id: "treatmentDate",
          label: "Treatment Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "eventDay", label: "Event Day", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = eventTimeTreatmentDateOffsetTool.execute;
export default eventTimeTreatmentDateOffsetTool;
