import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly queryOpenedDate: string;
  readonly cutoffDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queryOpenedDate: { type: "string", maxLength: 8192 },
    cutoffDate: { type: "string", maxLength: 8192 },
  },
  required: ["queryOpenedDate", "cutoffDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days from an explicit query opening to a supplied cutoff date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { queryOpenedDate, cutoffDate } = request;
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
        (namedDate(cutoffDate, "cutoffDate").getTime() -
          namedDate(queryOpenedDate, "queryOpenedDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { queryOpenedDate: "2026-10-28", cutoffDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const clinicalQueryAgeAtCutoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-research",
        "clinical research",
        "research and quality management",
      ],
      keywords: ["clinical research", "research and quality management"],
    },
    id: "clinical-research/clinical-query-age-at-cutoff",
    title: "Clinical Query Age At Cutoff",
    description:
      "Count signed calendar days from an explicit query opening to a supplied cutoff date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queryOpenedDate: { type: "string", maxLength: 8192 },
        cutoffDate: { type: "string", maxLength: 8192 },
      },
      required: ["queryOpenedDate", "cutoffDate"],
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
          id: "queryOpenedDate",
          label: "Query Opened Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cutoffDate",
          label: "Cutoff Date",
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
export const run = clinicalQueryAgeAtCutoffTool.execute;
export default clinicalQueryAgeAtCutoffTool;
