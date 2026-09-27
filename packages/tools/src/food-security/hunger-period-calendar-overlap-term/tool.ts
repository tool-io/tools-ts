import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodStart: number;
  readonly periodEnd: number;
  readonly recallStart: number;
  readonly recallEnd: number;
};
export type Output = { readonly overlapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodStart: { type: "integer" },
    periodEnd: { type: "integer" },
    recallStart: { type: "integer" },
    recallEnd: { type: "integer" },
  },
  required: ["periodStart", "periodEnd", "recallStart", "recallEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapDays: { type: "integer" } },
  required: ["overlapDays"],
} as const;
/** Overlap of half-open day-index intervals, with touching endpoints contributing zero days. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodStart, periodEnd, recallStart, recallEnd } = request;
  const compute = (): Output => {
    H.domain(periodEnd >= periodStart && recallEnd >= recallStart);
    return {
      overlapDays: Math.max(
        0,
        Math.min(periodEnd, recallEnd) - Math.max(periodStart, recallStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { periodStart: 10, periodEnd: 40, recallStart: 30, recallEnd: 50 },
  output: { overlapDays: 10 },
} satisfies ToolExample<Input, Output>;
export const hungerPeriodCalendarOverlapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/hunger-period-calendar-overlap-term",
    title: "Hunger Period Calendar Overlap Term Tool",
    description:
      "Overlap of half-open day-index intervals, with touching endpoints contributing zero days.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodStart: { type: "integer" },
        periodEnd: { type: "integer" },
        recallStart: { type: "integer" },
        recallEnd: { type: "integer" },
      },
      required: ["periodStart", "periodEnd", "recallStart", "recallEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapDays: { type: "integer" } },
      required: ["overlapDays"],
    },
    ports: {
      inputs: [
        {
          id: "periodStart",
          label: "Period Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "periodEnd",
          label: "Period End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recallStart",
          label: "Recall Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recallEnd",
          label: "Recall End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "overlapDays",
          label: "Overlap Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hungerPeriodCalendarOverlapTermTool.execute;
export default hungerPeriodCalendarOverlapTermTool;
