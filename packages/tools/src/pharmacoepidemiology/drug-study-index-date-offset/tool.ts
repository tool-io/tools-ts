import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly indexDate: string;
  readonly observationDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indexDate: { type: "string", maxLength: 8192 },
    observationDate: { type: "string", maxLength: 8192 },
  },
  required: ["indexDate", "observationDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed calendar days from an explicit drug-study index date to an observation date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indexDate, observationDate } = request;
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
        (namedDate(observationDate, "observationDate").getTime() -
          namedDate(indexDate, "indexDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { indexDate: "2026-10-28", observationDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const drugStudyIndexDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/drug-study-index-date-offset",
    title: "Drug Study Index Date Offset",
    description:
      "Calculate signed calendar days from an explicit drug-study index date to an observation date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indexDate: { type: "string", maxLength: 8192 },
        observationDate: { type: "string", maxLength: 8192 },
      },
      required: ["indexDate", "observationDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "number" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "indexDate",
          label: "Index Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observationDate",
          label: "Observation Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = drugStudyIndexDateOffsetTool.execute;
export default drugStudyIndexDateOffsetTool;
