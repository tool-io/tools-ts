import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly priorReportEndDate: string;
  readonly currentReportStartDate: string;
  readonly coveredGapDays: number;
}>;
export type Output = Readonly<{
  readonly calendarGapDays: number;
  readonly uncoveredGapDays: number;
  readonly fullyCovered: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = new Date(`${input.priorReportEndDate}T00:00:00Z`),
    b = new Date(`${input.currentReportStartDate}T00:00:00Z`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a)
    simpleError(
      "currentReportStartDate",
      "Dates must be valid and ordered.",
      "invalid_dates",
    );
  const calendarGapDays = Math.max(
      0,
      Math.floor((b.getTime() - a.getTime()) / 86400000) - 1,
    ),
    uncoveredGapDays = Math.max(0, calendarGapDays - input.coveredGapDays);
  return {
    calendarGapDays,
    uncoveredGapDays,
    fullyCovered: uncoveredGapDays === 0,
  };
};

export const exampleInput = {
  priorReportEndDate: "2025-01-01",
  currentReportStartDate: "2025-01-12",
  coveredGapDays: 10,
} satisfies Input;
export const exampleOutput = {
  calendarGapDays: 10,
  uncoveredGapDays: 0,
  fullyCovered: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      priorReportEndDate: input.priorReportEndDate as string,
      currentReportStartDate: input.currentReportStartDate as string,
      coveredGapDays: input.coveredGapDays as number,
    }),
  description: "Measure the uncovered gap between Type 2 report periods.",
  id: "auditing/type-two-gap-coverage",
  inputs: [
    {
      id: "priorReportEndDate",
      label: "Prior report end date",
      kind: "string",
    },
    {
      id: "currentReportStartDate",
      label: "Current report start date",
      kind: "string",
    },
    {
      id: "coveredGapDays",
      label: "Gap days covered by other procedures",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "calendarGapDays",
      label: "Calendar gap days",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "uncoveredGapDays",
      label: "Uncovered gap days",
      kind: "integer",
      minimum: 0,
    },
    { id: "fullyCovered", label: "Gap fully covered", kind: "boolean" },
  ],
  title: "Type 2 Gap Coverage",
});

export const run = tool.execute;
export default tool;
