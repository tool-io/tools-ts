import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly year: number;
  readonly month: number;
  readonly originYear: number;
  readonly originMonth: number;
};
export type Output = { readonly monthOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    month: { type: "integer", minimum: 1, maximum: 12 },
    originYear: { type: "integer" },
    originMonth: { type: "integer", minimum: 1, maximum: 12 },
  },
  required: ["year", "month", "originYear", "originMonth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { monthOffset: { type: "integer" } },
  required: ["monthOffset"],
} as const;
/** Compare supplied astronomical year/month indices with exact integer arithmetic, without day/calendar-duration conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, month, originYear, originMonth } = request;
  const compute = (): Output => {
    H.integer(month, 1, 12);
    H.integer(originMonth, 1, 12);
    return {
      monthOffset: Number(
        (BigInt(year) - BigInt(originYear)) * 12n + BigInt(month - originMonth),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { year: 2026, month: 3, originYear: 2025, originMonth: 11 },
  output: { monthOffset: 4 },
} satisfies ToolExample<Input, Output>;
export const monthIndexRelativeOriginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/month-index-relative-origin",
    title: "Month Index Relative Origin Tool",
    description:
      "Compare supplied astronomical year/month indices with exact integer arithmetic, without day/calendar-duration conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        month: { type: "integer", minimum: 1, maximum: 12 },
        originYear: { type: "integer" },
        originMonth: { type: "integer", minimum: 1, maximum: 12 },
      },
      required: ["year", "month", "originYear", "originMonth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { monthOffset: { type: "integer" } },
      required: ["monthOffset"],
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
          id: "month",
          label: "Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originYear",
          label: "Origin Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originMonth",
          label: "Origin Month",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "monthOffset",
          label: "Month Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = monthIndexRelativeOriginTool.execute;
export default monthIndexRelativeOriginTool;
