import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  daysBetween,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly independentlyLoggedDepositDate: string;
  readonly independentlyLoggedCollectedDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyLoggedDepositDate",
    label: "Independently logged deposit date",
    kind: "string",
  },
  {
    id: "independentlyLoggedCollectedDate",
    label: "Independently logged collected date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const d = daysBetween(
    input.independentlyLoggedDepositDate,
    input.independentlyLoggedCollectedDate,
  );
  if (d < 0)
    simpleError(
      "dates",
      "Independently logged collection must not precede deposit.",
    );
  return { observedUncollectedIntervalDays: d };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyLoggedDepositDate: "2026-01-01",
    independentlyLoggedCollectedDate: "2026-01-04",
  },
  output: { result: { observedUncollectedIntervalDays: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/check-kiting-float-interval-between-accounts-math",
  title: "Check Kiting Float Interval Between Accounts Math",
  description:
    "Measure actual retrospectively logged uncollected-check interval in Gregorian calendar days for reconciliation/fraud investigation, not optimize check kiting, bank-specific availability, legal float or criminal intent.",
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
