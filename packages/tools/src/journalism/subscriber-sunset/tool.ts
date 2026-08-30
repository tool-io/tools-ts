import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cancellationDate: string;
  readonly accessEndDate: string;
  readonly allowedSunsetDays: number;
}>;
export type Output = Readonly<{
  readonly sunsetDays: number;
  readonly daysBeyondAllowance: number;
  readonly withinAllowance: boolean;
}>;

export const calculate = (input: Input): Output => {
  const parse = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
      simpleError(
        "cancellationDate",
        "Dates must use YYYY-MM-DD.",
        "invalid_date",
      );
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()))
      simpleError("cancellationDate", "Date is invalid.", "invalid_date");
    return date;
  };
  const start = parse(input.cancellationDate),
    end = parse(input.accessEndDate);
  const sunsetDays = Math.floor((end.getTime() - start.getTime()) / 86400000);
  if (sunsetDays < 0)
    simpleError(
      "accessEndDate",
      "Access end cannot precede cancellation.",
      "invalid_range",
    );
  return {
    sunsetDays,
    daysBeyondAllowance: Math.max(0, sunsetDays - input.allowedSunsetDays),
    withinAllowance: sunsetDays <= input.allowedSunsetDays,
  };
};

export const exampleInput = {
  cancellationDate: "2025-01-01",
  accessEndDate: "2025-01-31",
  allowedSunsetDays: 30,
} satisfies Input;
export const exampleOutput = {
  sunsetDays: 30,
  daysBeyondAllowance: 0,
  withinAllowance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cancellationDate: input.cancellationDate as string,
      accessEndDate: input.accessEndDate as string,
      allowedSunsetDays: input.allowedSunsetDays as number,
    }),
  description:
    "Measure subscriber access sunset timing against a supplied allowance.",
  id: "journalism/subscriber-sunset",
  inputs: [
    {
      id: "cancellationDate",
      label: "Subscription cancellation date",
      kind: "string",
    },
    { id: "accessEndDate", label: "Access end date", kind: "string" },
    {
      id: "allowedSunsetDays",
      label: "Allowed sunset duration",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
  ],
  outputs: [
    {
      id: "sunsetDays",
      label: "Access sunset duration",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "daysBeyondAllowance",
      label: "Days beyond allowance",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "withinAllowance",
      label: "Within supplied allowance",
      kind: "boolean",
    },
  ],
  title: "Subscriber Sunset",
});

export const run = tool.execute;
export default tool;
