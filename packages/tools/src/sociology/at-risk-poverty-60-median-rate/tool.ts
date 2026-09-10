import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  median,
  sampleIncome,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedEquivalizedIncomes: readonly number[];
  readonly callerMatchedMedianIncome: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedEquivalizedIncomes",
    label: "Observed equivalized incomes",
    kind: "numberList",
  },
  {
    id: "callerMatchedMedianIncome",
    label: "Caller matched median income",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  sampleIncome(input.observedEquivalizedIncomes);
  positive(input.callerMatchedMedianIncome, "median");
  return {
    observedBelowSixtyPercentMedianFraction:
      input.observedEquivalizedIncomes.filter(
        (v) => v < 0.6 * input.callerMatchedMedianIncome,
      ).length / input.observedEquivalizedIncomes.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedEquivalizedIncomes: [10, 20, 30],
    callerMatchedMedianIncome: 30,
  },
  output: {
    result: { observedBelowSixtyPercentMedianFraction: 0.3333333333333333 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/at-risk-poverty-60-median-rate",
  title: "At-Risk-of-Poverty 60% Median Rate Calculator",
  description:
    "Actual equally weighted sample share strictly below60%of independently established compatible median equivalized income. Not all population median inference or legal poverty classification.",
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
