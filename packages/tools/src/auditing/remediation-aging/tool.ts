import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly findingDate: string;
  readonly asOfDate: string;
  readonly targetRemediationDays: number;
  readonly remediationComplete: boolean;
  readonly highSeverity: boolean;
}>;
export type Output = Readonly<{
  readonly findingAgeDays: number;
  readonly daysPastTarget: number;
  readonly status: string;
}>;

export const calculate = (input: Input): Output => {
  const start = new Date(`${input.findingDate}T00:00:00Z`),
    end = new Date(`${input.asOfDate}T00:00:00Z`);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  )
    simpleError(
      "asOfDate",
      "Dates must be valid and ordered.",
      "invalid_dates",
    );
  const findingAgeDays = Math.floor(
      (end.getTime() - start.getTime()) / 86400000,
    ),
    daysPastTarget = Math.max(0, findingAgeDays - input.targetRemediationDays);
  return {
    findingAgeDays,
    daysPastTarget,
    status: input.remediationComplete
      ? "closed"
      : daysPastTarget === 0
        ? "on-track"
        : input.highSeverity
          ? "critical-overdue"
          : "overdue",
  };
};

export const exampleInput = {
  findingDate: "2025-01-01",
  asOfDate: "2025-02-15",
  targetRemediationDays: 30,
  remediationComplete: false,
  highSeverity: true,
} satisfies Input;
export const exampleOutput = {
  findingAgeDays: 45,
  daysPastTarget: 15,
  status: "critical-overdue",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      findingDate: input.findingDate as string,
      asOfDate: input.asOfDate as string,
      targetRemediationDays: input.targetRemediationDays as number,
      remediationComplete: input.remediationComplete as boolean,
      highSeverity: input.highSeverity as boolean,
    }),
  description: "Age remediation findings against a caller-supplied target.",
  id: "auditing/remediation-aging",
  inputs: [
    { id: "findingDate", label: "Finding date", kind: "string" },
    { id: "asOfDate", label: "As-of date", kind: "string" },
    {
      id: "targetRemediationDays",
      label: "Target remediation days",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "remediationComplete",
      label: "Remediation complete",
      kind: "boolean",
    },
    { id: "highSeverity", label: "High-severity finding", kind: "boolean" },
  ],
  outputs: [
    {
      id: "findingAgeDays",
      label: "Finding age",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "daysPastTarget",
      label: "Days past target",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "status",
      label: "Remediation status",
      kind: "string",
      enum: ["closed", "on-track", "overdue", "critical-overdue"],
    },
  ],
  title: "Remediation Aging",
});

export const run = tool.execute;
export default tool;
