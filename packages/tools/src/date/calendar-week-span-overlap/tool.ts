import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStartDay: number;
  readonly secondStartDay: number;
};
export type Output = {
  readonly overlapDays: number;
  readonly firstEndExclusive: number;
  readonly secondEndExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStartDay: { type: "integer" },
    secondStartDay: { type: "integer" },
  },
  required: ["firstStartDay", "secondStartDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDays: { type: "integer" },
    firstEndExclusive: { type: "integer" },
    secondEndExclusive: { type: "integer" },
  },
  required: ["overlapDays", "firstEndExclusive", "secondEndExclusive"],
} as const;
/** Intersect two supplied seven-day calendar spans using half-open absolute-day bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStartDay, secondStartDay } = request;
  const compute = (): Output => {
    return {
      overlapDays: Math.max(0, 7 - Math.abs(secondStartDay - firstStartDay)),
      firstEndExclusive: firstStartDay + 7,
      secondEndExclusive: secondStartDay + 7,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStartDay: 100, secondStartDay: 103 },
  output: { overlapDays: 4, firstEndExclusive: 107, secondEndExclusive: 110 },
} satisfies ToolExample<Input, Output>;
export const calendarWeekSpanOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/calendar-week-span-overlap",
    title: "Calendar Week Span Overlap Tool",
    description:
      "Intersect two supplied seven-day calendar spans using half-open absolute-day bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStartDay: { type: "integer" },
        secondStartDay: { type: "integer" },
      },
      required: ["firstStartDay", "secondStartDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDays: { type: "integer" },
        firstEndExclusive: { type: "integer" },
        secondEndExclusive: { type: "integer" },
      },
      required: ["overlapDays", "firstEndExclusive", "secondEndExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "firstStartDay",
          label: "First Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondStartDay",
          label: "Second Start Day",
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
        {
          id: "firstEndExclusive",
          label: "First End Exclusive",
          valueType: { type: "integer" },
        },
        {
          id: "secondEndExclusive",
          label: "Second End Exclusive",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = calendarWeekSpanOverlapTool.execute;
export default calendarWeekSpanOverlapTool;
