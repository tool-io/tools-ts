import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedCutoffDate: string;
  readonly birthDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedCutoffDate: { type: "string", maxLength: 8192 },
    birthDate: { type: "string", maxLength: 8192 },
  },
  required: ["suppliedCutoffDate", "birthDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed date-only birth-minus-cutoff calendar days without determining school-entry eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedCutoffDate, birthDate } = request;
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
        (namedDate(birthDate, "birthDate").getTime() -
          namedDate(suppliedCutoffDate, "suppliedCutoffDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedCutoffDate: "2026-10-28", birthDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const schoolEntryCutoffDateDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/school-entry-cutoff-date-distance",
    title: "School Entry Cutoff Date Distance Tool",
    description:
      "Calculate signed date-only birth-minus-cutoff calendar days without determining school-entry eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedCutoffDate: { type: "string", maxLength: 8192 },
        birthDate: { type: "string", maxLength: 8192 },
      },
      required: ["suppliedCutoffDate", "birthDate"],
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
          id: "suppliedCutoffDate",
          label: "Supplied Cutoff Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "birthDate",
          label: "Birth Date",
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
export const run = schoolEntryCutoffDateDistanceTool.execute;
export default schoolEntryCutoffDateDistanceTool;
