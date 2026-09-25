import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
  mod,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly year: number;
  readonly month: number;
  readonly startMonth: number;
};
export type Output = {
  readonly fiscalStartYear: number;
  readonly period: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: 1, maximum: 9999 },
    month: { type: "integer", minimum: 1, maximum: 12 },
    startMonth: { type: "integer", minimum: 1, maximum: 12 },
  },
  required: ["year", "month", "startMonth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fiscalStartYear: { type: "integer" },
    period: { type: "integer" },
  },
  required: ["fiscalStartYear", "period"],
} as const;
/** Compute fiscal period label explicit start month from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { year, month, startMonth } = input;
  const compute = (): Output => {
    integer(year, 1, 9999);
    integer(month, 1, 12);
    integer(startMonth, 1, 12);
    return {
      fiscalStartYear: month < startMonth ? year - 1 : year,
      period: mod(month - startMonth, 12) + 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { year: 2024, month: 2, startMonth: 4 },
  output: { fiscalStartYear: 2023, period: 11 },
} satisfies ToolExample<Input, Output>;
export const fiscalPeriodLabelExplicitStartMonthTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/fiscal-period-label-explicit-start-month",
  title: "Fiscal Period Label Explicit Start Month Tool",
  description:
    "Compute fiscal period label explicit start month from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "year",
        label: "Year",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "month",
        label: "Month",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "startMonth",
        label: "Start Month",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "fiscalStartYear",
        label: "Fiscal Start Year",
        valueType: { type: "integer" },
      },
      { id: "period", label: "Period", valueType: { type: "integer" } },
    ],
  },
});
export const run = fiscalPeriodLabelExplicitStartMonthTool.execute;
export default fiscalPeriodLabelExplicitStartMonthTool;
