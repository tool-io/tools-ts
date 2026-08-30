import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly receivedDate: string;
  readonly asOfDate: string;
  readonly expectedProcessingDays: number;
}>;
export type Output = Readonly<{
  readonly elapsedDays: number;
  readonly daysBeyondExpectation: number;
  readonly beyondExpectedDuration: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.receivedDate) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(input.asOfDate)
  )
    simpleError("receivedDate", "Dates must use YYYY-MM-DD.", "invalid_date");
  const start = new Date(`${input.receivedDate}T00:00:00Z`),
    end = new Date(`${input.asOfDate}T00:00:00Z`);
  const elapsedDays = Math.floor((end.getTime() - start.getTime()) / 86400000);
  if (!Number.isFinite(elapsedDays) || elapsedDays < 0)
    simpleError(
      "asOfDate",
      "As-of date must not precede a valid received date.",
      "invalid_range",
    );
  return {
    elapsedDays,
    daysBeyondExpectation: Math.max(
      0,
      elapsedDays - input.expectedProcessingDays,
    ),
    beyondExpectedDuration: elapsedDays > input.expectedProcessingDays,
  };
};

export const exampleInput = {
  receivedDate: "2025-01-01",
  asOfDate: "2025-01-11",
  expectedProcessingDays: 7,
} satisfies Input;
export const exampleOutput = {
  elapsedDays: 10,
  daysBeyondExpectation: 3,
  beyondExpectedDuration: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      receivedDate: input.receivedDate as string,
      asOfDate: input.asOfDate as string,
      expectedProcessingDays: input.expectedProcessingDays as number,
    }),
  description:
    "Measure amended-return processing delay against a caller-supplied expectation.",
  id: "taxation/amended-return-delay",
  inputs: [
    {
      id: "receivedDate",
      label: "Amended-return received date",
      kind: "string",
    },
    { id: "asOfDate", label: "Status as-of date", kind: "string" },
    {
      id: "expectedProcessingDays",
      label: "Expected processing duration",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "elapsedDays",
      label: "Elapsed calendar days",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "daysBeyondExpectation",
      label: "Days beyond expectation",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "beyondExpectedDuration",
      label: "Beyond supplied duration",
      kind: "boolean",
    },
  ],
  title: "Amended-Return Delay",
});

export const run = tool.execute;
export default tool;
