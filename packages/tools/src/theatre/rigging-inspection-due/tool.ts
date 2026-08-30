import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lastInspectionDate: string;
  readonly inspectionIntervalDays: number;
  readonly asOfDate: string;
}>;
export type Output = Readonly<{
  readonly nextInspectionDate: string;
  readonly daysUntilDue: number;
  readonly overdue: boolean;
}>;

export const calculate = (input: Input): Output => {
  const parse = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
      simpleError(
        "lastInspectionDate",
        "Dates must use YYYY-MM-DD.",
        "invalid_date",
      );
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()))
      simpleError("lastInspectionDate", "Date is invalid.", "invalid_date");
    return date;
  };
  const next = parse(input.lastInspectionDate);
  next.setUTCDate(next.getUTCDate() + input.inspectionIntervalDays);
  const asOf = parse(input.asOfDate),
    daysUntilDue = Math.ceil((next.getTime() - asOf.getTime()) / 86400000);
  return {
    nextInspectionDate: next.toISOString().slice(0, 10),
    daysUntilDue,
    overdue: daysUntilDue < 0,
  };
};

export const exampleInput = {
  lastInspectionDate: "2025-01-01",
  inspectionIntervalDays: 365,
  asOfDate: "2025-12-01",
} satisfies Input;
export const exampleOutput = {
  nextInspectionDate: "2026-01-01",
  daysUntilDue: 31,
  overdue: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lastInspectionDate: input.lastInspectionDate as string,
      inspectionIntervalDays: input.inspectionIntervalDays as number,
      asOfDate: input.asOfDate as string,
    }),
  description:
    "Calculate the next rigging inspection date from a supplied interval.",
  id: "theatre/rigging-inspection-due",
  inputs: [
    { id: "lastInspectionDate", label: "Last inspection date", kind: "string" },
    {
      id: "inspectionIntervalDays",
      label: "Inspection interval",
      kind: "integer",
      minimum: 1,
      unit: "days",
    },
    { id: "asOfDate", label: "As-of date", kind: "string" },
  ],
  outputs: [
    { id: "nextInspectionDate", label: "Next inspection date", kind: "string" },
    { id: "daysUntilDue", label: "Days until due", kind: "integer" },
    { id: "overdue", label: "Inspection is overdue", kind: "boolean" },
  ],
  title: "Rigging Inspection Due",
});

export const run = tool.execute;
export default tool;
