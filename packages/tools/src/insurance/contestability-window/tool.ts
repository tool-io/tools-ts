import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly policyEffectiveDate: string;
  readonly eventDate: string;
  readonly contestabilityMonths: number;
}>;
export type Output = Readonly<{
  readonly elapsedMonths: number;
  readonly monthsRemaining: number;
  readonly withinWindow: boolean;
}>;

export const calculate = (input: Input): Output => {
  const start = new Date(`${input.policyEffectiveDate}T00:00:00Z`),
    event = new Date(`${input.eventDate}T00:00:00Z`);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(event.getTime()) ||
    event < start
  )
    simpleError(
      "eventDate",
      "Dates must be valid and ordered.",
      "invalid_dates",
    );
  let elapsedMonths =
    (event.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    event.getUTCMonth() -
    start.getUTCMonth();
  if (event.getUTCDate() < start.getUTCDate()) elapsedMonths -= 1;
  return {
    elapsedMonths,
    monthsRemaining: Math.max(0, input.contestabilityMonths - elapsedMonths),
    withinWindow: elapsedMonths < input.contestabilityMonths,
  };
};

export const exampleInput = {
  policyEffectiveDate: "2024-01-15",
  eventDate: "2025-01-15",
  contestabilityMonths: 24,
} satisfies Input;
export const exampleOutput = {
  elapsedMonths: 12,
  monthsRemaining: 12,
  withinWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      policyEffectiveDate: input.policyEffectiveDate as string,
      eventDate: input.eventDate as string,
      contestabilityMonths: input.contestabilityMonths as number,
    }),
  description:
    "Check an event date against a caller-supplied contestability window.",
  id: "insurance/contestability-window",
  inputs: [
    {
      id: "policyEffectiveDate",
      label: "Policy effective date",
      kind: "string",
    },
    { id: "eventDate", label: "Event date", kind: "string" },
    {
      id: "contestabilityMonths",
      label: "Contestability period",
      kind: "integer",
      minimum: 0,
      unit: "months",
    },
  ],
  outputs: [
    {
      id: "elapsedMonths",
      label: "Elapsed whole months",
      kind: "integer",
      minimum: 0,
      unit: "months",
    },
    {
      id: "monthsRemaining",
      label: "Contestability months remaining",
      kind: "integer",
      minimum: 0,
      unit: "months",
    },
    {
      id: "withinWindow",
      label: "Within supplied contestability window",
      kind: "boolean",
    },
  ],
  title: "Contestability Window",
});

export const run = tool.execute;
export default tool;
