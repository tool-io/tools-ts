import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly serviceDate: string;
  readonly responseDays: number;
  readonly asOfDate: string;
}>;
export type Output = Readonly<{
  readonly responseDeadline: string;
  readonly daysRemaining: number;
  readonly overdue: boolean;
}>;

export const calculate = (input: Input): Output => {
  const parse = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
      simpleError("serviceDate", "Dates must use YYYY-MM-DD.", "invalid_date");
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()))
      simpleError("serviceDate", "Date is invalid.", "invalid_date");
    return date;
  };
  const deadline = parse(input.serviceDate);
  deadline.setUTCDate(deadline.getUTCDate() + input.responseDays);
  const asOf = parse(input.asOfDate);
  const daysRemaining = Math.ceil(
    (deadline.getTime() - asOf.getTime()) / 86400000,
  );
  return {
    responseDeadline: deadline.toISOString().slice(0, 10),
    daysRemaining,
    overdue: daysRemaining < 0,
  };
};

export const exampleInput = {
  serviceDate: "2025-01-01",
  responseDays: 20,
  asOfDate: "2025-01-11",
} satisfies Input;
export const exampleOutput = {
  responseDeadline: "2025-01-21",
  daysRemaining: 10,
  overdue: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      serviceDate: input.serviceDate as string,
      responseDays: input.responseDays as number,
      asOfDate: input.asOfDate as string,
    }),
  description:
    "Calculate a tax-summons response deadline from a caller-supplied window.",
  id: "taxation/summons-response-window",
  inputs: [
    { id: "serviceDate", label: "Summons service date", kind: "string" },
    {
      id: "responseDays",
      label: "Response window",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    { id: "asOfDate", label: "As-of date", kind: "string" },
  ],
  outputs: [
    { id: "responseDeadline", label: "Response deadline", kind: "string" },
    { id: "daysRemaining", label: "Calendar days remaining", kind: "integer" },
    { id: "overdue", label: "Response is overdue", kind: "boolean" },
  ],
  title: "Summons Response Window",
});

export const run = tool.execute;
export default tool;
