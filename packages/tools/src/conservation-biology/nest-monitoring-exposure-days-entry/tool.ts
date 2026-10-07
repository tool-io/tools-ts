import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryDate: string;
  readonly lastObservationDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryDate: { type: "string", maxLength: 8192 },
    lastObservationDate: { type: "string", maxLength: 8192 },
  },
  required: ["entryDate", "lastObservationDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed nest-monitoring date-only exposure days without selecting nest-survival estimators. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryDate, lastObservationDate } = request;
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
        (namedDate(lastObservationDate, "lastObservationDate").getTime() -
          namedDate(entryDate, "entryDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryDate: "2026-10-28", lastObservationDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const nestMonitoringExposureDaysEntryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/nest-monitoring-exposure-days-entry",
    title: "Nest Monitoring Exposure Days Entry",
    description:
      "Calculate signed nest-monitoring date-only exposure days without selecting nest-survival estimators.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryDate: { type: "string", maxLength: 8192 },
        lastObservationDate: { type: "string", maxLength: 8192 },
      },
      required: ["entryDate", "lastObservationDate"],
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
          id: "entryDate",
          label: "Entry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lastObservationDate",
          label: "Last Observation Date",
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
export const run = nestMonitoringExposureDaysEntryTool.execute;
export default nestMonitoringExposureDaysEntryTool;
