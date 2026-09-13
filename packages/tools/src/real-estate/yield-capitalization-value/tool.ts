import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, sum } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualNextPeriodsNoi: readonly number[];
  readonly callerIndependentDiscountRate: number;
  readonly callerIndependentNetReversionValue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNextPeriodsNoi",
    label: "Actual next periods noi",
    kind: "numberList",
  },
  {
    id: "callerIndependentDiscountRate",
    label: "Caller independent discount rate",
    kind: "number",
  },
  {
    id: "callerIndependentNetReversionValue",
    label: "Caller independent net reversion value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualNextPeriodsNoi.length)
    simpleError("actualNextPeriodsNoi", "Actual nonempty observations.");
  if (input.callerIndependentDiscountRate <= -1)
    simpleError("rate", "Actualrate>-1.");
  return {
    value:
      sum(
        input.actualNextPeriodsNoi.map(
          (v, i) => v / (1 + input.callerIndependentDiscountRate) ** (i + 1),
        ),
      ) +
      input.callerIndependentNetReversionValue /
        (1 + input.callerIndependentDiscountRate) **
          input.actualNextPeriodsNoi.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualNextPeriodsNoi: [50, 50],
    callerIndependentDiscountRate: 0,
    callerIndependentNetReversionValue: 50,
  },
  output: { result: { value: 150 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/yield-capitalization-value",
  title: "Yield Capitalization Value Calculator",
  description:
    "Explicit yieldcapitalizationDCFfutureNOIplus separately externally assessed NET reversion under actual dis counter, period1\u2026Nmatchingunits/timing, currency. Not simpleNOI/cap direct capitalization or select appreciation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
