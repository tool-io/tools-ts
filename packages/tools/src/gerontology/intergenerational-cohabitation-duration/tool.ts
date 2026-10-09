import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohabitationStartDate: string;
  readonly cohabitationEndDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohabitationStartDate: { type: "string", maxLength: 8192 },
    cohabitationEndDate: { type: "string", maxLength: 8192 },
  },
  required: ["cohabitationStartDate", "cohabitationEndDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed date-only calendar days between supplied intergenerational cohabitation endpoints without inclusive person-day adjustments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohabitationStartDate, cohabitationEndDate } = request;
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
        (namedDate(cohabitationEndDate, "cohabitationEndDate").getTime() -
          namedDate(cohabitationStartDate, "cohabitationStartDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cohabitationStartDate: "2026-10-28",
    cohabitationEndDate: "2026-11-01",
  },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const intergenerationalCohabitationDurationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/intergenerational-cohabitation-duration",
      title: "Intergenerational Cohabitation Duration Tool",
      description:
        "Calculate signed date-only calendar days between supplied intergenerational cohabitation endpoints without inclusive person-day adjustments.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cohabitationStartDate: { type: "string", maxLength: 8192 },
          cohabitationEndDate: { type: "string", maxLength: 8192 },
        },
        required: ["cohabitationStartDate", "cohabitationEndDate"],
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
            id: "cohabitationStartDate",
            label: "Cohabitation Start Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "cohabitationEndDate",
            label: "Cohabitation End Date",
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
export const run = intergenerationalCohabitationDurationTool.execute;
export default intergenerationalCohabitationDurationTool;
