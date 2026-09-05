import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, dateOrder } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly grantDate: string;
  readonly asOfDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "grantDate", label: "Grant date", kind: "string" },
  { id: "asOfDate", label: "As of date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return { signedCalendarDays: dateOrder(input.grantDate, input.asOfDate) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { grantDate: "2020-01-01", asOfDate: "2026-01-01" },
  output: { result: { signedCalendarDays: 2192 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/grant-date-age-calculator",
  title: "Grant Reference Date Age Calculator",
  description:
    "Actual Gregorian grant reference age as signed civil days; not entitlement or imprecise day/365integer age.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
