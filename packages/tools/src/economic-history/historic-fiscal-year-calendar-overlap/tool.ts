import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fiscalStartDay: number;
  readonly fiscalEndDay: number;
  readonly calendarStartDay: number;
  readonly calendarEndDay: number;
};
export type Output = {
  readonly overlapDays: number;
  readonly fiscalShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fiscalStartDay: { type: "integer" },
    fiscalEndDay: { type: "integer" },
    calendarStartDay: { type: "integer" },
    calendarEndDay: { type: "integer" },
  },
  required: [
    "fiscalStartDay",
    "fiscalEndDay",
    "calendarStartDay",
    "calendarEndDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDays: { type: "integer" },
    fiscalShare: { type: "number" },
  },
  required: ["overlapDays", "fiscalShare"],
} as const;
/** Overlap of half-open intervals on an explicit absolute-day axis; no jurisdictional fiscal calendar is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fiscalStartDay, fiscalEndDay, calendarStartDay, calendarEndDay } =
    request;
  const compute = (): Output => {
    H.domain(
      fiscalEndDay > fiscalStartDay && calendarEndDay >= calendarStartDay,
    );
    return {
      overlapDays: Math.max(
        0,
        Math.min(fiscalEndDay, calendarEndDay) -
          Math.max(fiscalStartDay, calendarStartDay),
      ),
      fiscalShare:
        Math.max(
          0,
          Math.min(fiscalEndDay, calendarEndDay) -
            Math.max(fiscalStartDay, calendarStartDay),
        ) /
        (fiscalEndDay - fiscalStartDay),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fiscalStartDay: 100,
    fiscalEndDay: 465,
    calendarStartDay: 0,
    calendarEndDay: 365,
  },
  output: { overlapDays: 265, fiscalShare: 0.726027397260274 },
} satisfies ToolExample<Input, Output>;
export const historicFiscalYearCalendarOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historic-fiscal-year-calendar-overlap",
    title: "Historic Fiscal Year Calendar Overlap Tool",
    description:
      "Overlap of half-open intervals on an explicit absolute-day axis; no jurisdictional fiscal calendar is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fiscalStartDay: { type: "integer" },
        fiscalEndDay: { type: "integer" },
        calendarStartDay: { type: "integer" },
        calendarEndDay: { type: "integer" },
      },
      required: [
        "fiscalStartDay",
        "fiscalEndDay",
        "calendarStartDay",
        "calendarEndDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDays: { type: "integer" },
        fiscalShare: { type: "number" },
      },
      required: ["overlapDays", "fiscalShare"],
    },
    ports: {
      inputs: [
        {
          id: "fiscalStartDay",
          label: "Fiscal Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fiscalEndDay",
          label: "Fiscal End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "calendarStartDay",
          label: "Calendar Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "calendarEndDay",
          label: "Calendar End Day",
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
          id: "fiscalShare",
          label: "Fiscal Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicFiscalYearCalendarOverlapTool.execute;
export default historicFiscalYearCalendarOverlapTool;
