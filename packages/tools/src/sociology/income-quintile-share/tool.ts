import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyResolvedQuintileIncomeTotals: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyResolvedQuintileIncomeTotals",
    label: "Actual independently resolved quintile income totals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.actualIndependentlyResolvedQuintileIncomeTotals.length !== 5)
    simpleError(
      "quintiles",
      "Actualfiveindependentlypopulation-balancedquintiles.",
    );
  input.actualIndependentlyResolvedQuintileIncomeTotals.forEach((v) =>
    nonnegative(v, "income"),
  );
  const t = positive(
    sum(input.actualIndependentlyResolvedQuintileIncomeTotals),
    "totalincome",
  );
  return {
    observedQuintileIncomePercentShares:
      input.actualIndependentlyResolvedQuintileIncomeTotals.map(
        (v) => (100 * v) / t,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyResolvedQuintileIncomeTotals: [1, 2, 3, 4, 10] },
  output: {
    result: { observedQuintileIncomePercentShares: [5, 10, 15, 20, 50] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/income-quintile-share",
  title: "Income Quintile Share Calculator",
  description:
    "Actual already resolved five equal-population income quintile totals into all five shares, not a single top-fraction sample tool, automatic grouping or implied social status. Income nonnegative branch/same currency/exposure independently established.",
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
