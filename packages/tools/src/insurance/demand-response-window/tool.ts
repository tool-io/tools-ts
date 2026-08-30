import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly demandReceivedDate: string;
  readonly acknowledgmentDays: number;
  readonly acknowledgedDate: string;
}>;
export type Output = Readonly<{
  readonly acknowledgmentDeadline: string;
  readonly responseDays: number;
  readonly daysLate: number;
  readonly onTime: boolean;
}>;

export const calculate = (input: Input): Output => {
  const start = new Date(`${input.demandReceivedDate}T00:00:00Z`),
    end = new Date(`${input.acknowledgedDate}T00:00:00Z`);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  )
    simpleError(
      "acknowledgedDate",
      "Dates must be valid and ordered.",
      "invalid_dates",
    );
  const deadline = new Date(start);
  deadline.setUTCDate(deadline.getUTCDate() + input.acknowledgmentDays);
  const responseDays = Math.floor((end.getTime() - start.getTime()) / 86400000),
    daysLate = Math.max(0, responseDays - input.acknowledgmentDays);
  return {
    acknowledgmentDeadline: deadline.toISOString().slice(0, 10),
    responseDays,
    daysLate,
    onTime: daysLate === 0,
  };
};

export const exampleInput = {
  demandReceivedDate: "2025-01-01",
  acknowledgmentDays: 10,
  acknowledgedDate: "2025-01-08",
} satisfies Input;
export const exampleOutput = {
  acknowledgmentDeadline: "2025-01-11",
  responseDays: 7,
  daysLate: 0,
  onTime: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      demandReceivedDate: input.demandReceivedDate as string,
      acknowledgmentDays: input.acknowledgmentDays as number,
      acknowledgedDate: input.acknowledgedDate as string,
    }),
  description:
    "Check demand-letter acknowledgment timing against a supplied window.",
  id: "insurance/demand-response-window",
  inputs: [
    { id: "demandReceivedDate", label: "Demand received date", kind: "string" },
    {
      id: "acknowledgmentDays",
      label: "Acknowledgment window",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    { id: "acknowledgedDate", label: "Acknowledged date", kind: "string" },
  ],
  outputs: [
    {
      id: "acknowledgmentDeadline",
      label: "Acknowledgment deadline",
      kind: "string",
    },
    { id: "responseDays", label: "Response days", kind: "integer", minimum: 0 },
    { id: "daysLate", label: "Days late", kind: "integer", minimum: 0 },
    { id: "onTime", label: "Acknowledged on time", kind: "boolean" },
  ],
  title: "Demand Response Window",
});

export const run = tool.execute;
export default tool;
