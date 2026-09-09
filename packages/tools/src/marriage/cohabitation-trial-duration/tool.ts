import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  daysBetween,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualStartDate: string;
  readonly actualEndDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualStartDate", label: "Actual start date", kind: "string" },
  { id: "actualEndDate", label: "Actual end date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const d = daysBetween(input.actualStartDate, input.actualEndDate);
  if (d < 0) simpleError("dates", "End date≥start date.");
  return { observedElapsedDays: d };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualStartDate: "2026-01-01", actualEndDate: "2026-01-03" },
  output: { result: { observedElapsedDays: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/cohabitation-trial-duration",
  title: "Cohabitation Trial Duration Calculator",
  description:
    "cohabitation mutually agreed trial elapsed Gregorian days. Start inclusive/endexclusive interval, no timezone/millisecond assumptions or recommendation about trial length.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
