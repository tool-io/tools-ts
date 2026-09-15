import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly principal: number;
  readonly annualSimpleRate: number;
  readonly termDays: number;
  readonly callerDayCountBasis: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "principal", label: "Principal", kind: "number" },
  { id: "annualSimpleRate", label: "Annual simple rate", kind: "number" },
  { id: "termDays", label: "Term days", kind: "number" },
  {
    id: "callerDayCountBasis",
    label: "Caller day count basis",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.principal, "principal");
  nonnegative(i.annualSimpleRate, "rate");
  nonnegative(i.termDays, "days");
  positive(i.callerDayCountBasis, "basis");
  const interest =
    (i.principal * i.annualSimpleRate * i.termDays) / i.callerDayCountBasis;
  return { simpleInterest: interest, maturityValue: i.principal + interest };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    principal: 1000,
    annualSimpleRate: 0.1,
    termDays: 90,
    callerDayCountBasis: 360,
  },
  output: { result: { simpleInterest: 25, maturityValue: 1025 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/note-receivable-maturity-value-interest",
  title: "Note Receivable Maturity Value Interest Calculator",
  description:
    "Simple-interest note maturity amount from actual caller day-count fraction; not compound amortization or contract interpretation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
