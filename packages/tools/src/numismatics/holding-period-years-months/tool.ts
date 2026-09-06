import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  daysBetween,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly acquisitionDate: string;
  readonly dispositionDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "acquisitionDate", label: "Acquisition date", kind: "string" },
  { id: "dispositionDate", label: "Disposition date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const elapsed = daysBetween(input.acquisitionDate, input.dispositionDate);
  if (elapsed < 0)
    simpleError("dates", "Disposition must not precede acquisition.");
  const [a, m, d] = input.acquisitionDate.split("-").map(Number),
    [y, n, e] = input.dispositionDate.split("-").map(Number);
  let months = (y - a) * 12 + n - m;
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0),
    last = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][n - 1];
  if (e < Math.min(d, last)) months--;
  return {
    elapsedCalendarDays: elapsed,
    completedCalendarMonths: months,
    wholeYears: Math.floor(months / 12),
    residualMonths: months % 12,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { acquisitionDate: "2024-02-29", dispositionDate: "2025-02-28" },
  output: {
    result: {
      elapsedCalendarDays: 365,
      completedCalendarMonths: 12,
      wholeYears: 1,
      residualMonths: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/holding-period-years-months",
  title: "Holding Period Years Months Calculator",
  description:
    "Gregorian elapsed holding duration with completed clamped-anniversary months:an end-of-month short month clamps the acquisition day. Calendar days exclude start/include elapsed endpoint; not tax holding-period classification or trading-day count.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
