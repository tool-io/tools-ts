import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deploymentDate: string;
  readonly retrievalDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deploymentDate: { type: "string", maxLength: 8192 },
    retrievalDate: { type: "string", maxLength: 8192 },
  },
  required: ["deploymentDate", "retrievalDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed date-only sediment-trap deployment exposure in calendar days without partial-day correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deploymentDate, retrievalDate } = request;
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
        (namedDate(retrievalDate, "retrievalDate").getTime() -
          namedDate(deploymentDate, "deploymentDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deploymentDate: "2026-10-28", retrievalDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const sedimentTrapExposureDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/sediment-trap-exposure-day-count",
    title: "Sediment Trap Exposure Day Count",
    description:
      "Calculate signed date-only sediment-trap deployment exposure in calendar days without partial-day correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deploymentDate: { type: "string", maxLength: 8192 },
        retrievalDate: { type: "string", maxLength: 8192 },
      },
      required: ["deploymentDate", "retrievalDate"],
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
          id: "deploymentDate",
          label: "Deployment Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "retrievalDate",
          label: "Retrieval Date",
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
export const run = sedimentTrapExposureDayCountTool.execute;
export default sedimentTrapExposureDayCountTool;
