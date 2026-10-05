import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly year: number;
  readonly intercalaryYears: readonly number[];
};
export type Output = { readonly intercalary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: -100000, maximum: 100000 },
    intercalaryYears: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["year", "intercalaryYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intercalary: { type: "boolean" } },
  required: ["intercalary"],
} as const;
/** Check a year against an explicit public-calendar intercalation list without choosing or computing a religious calendar rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, intercalaryYears } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(year) && year >= -100000 && year <= 100000,
      "year",
    ),
      year);
    intercalaryYears.forEach((y) => H.integer(y, -100000, 100000));
    return { intercalary: intercalaryYears.includes(year) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { year: 2026, intercalaryYears: [2024, 2026, 2029] },
  output: { intercalary: true },
} satisfies ToolExample<Input, Output>;
export const publicCalendarIntercalationFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/public-calendar-intercalation-flag",
    title: "Public Calendar Intercalation Flag Tool",
    description:
      "Check a year against an explicit public-calendar intercalation list without choosing or computing a religious calendar rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer", minimum: -100000, maximum: 100000 },
        intercalaryYears: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["year", "intercalaryYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intercalary: { type: "boolean" } },
      required: ["intercalary"],
    },
    ports: {
      inputs: [
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "intercalaryYears",
          label: "Intercalary Years",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "intercalary",
          label: "Intercalary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCalendarIntercalationFlagTool.execute;
export default publicCalendarIntercalationFlagTool;
