import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sampleIncome,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerLocalReferenceIncomes: readonly number[];
  readonly observedPersonalIncome: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerLocalReferenceIncomes",
    label: "Caller local reference incomes",
    kind: "numberList",
  },
  {
    id: "observedPersonalIncome",
    label: "Observed personal income",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  sampleIncome(input.callerLocalReferenceIncomes);
  nonnegative(input.observedPersonalIncome, "income");
  const lower = input.callerLocalReferenceIncomes.filter(
      (v) => v < input.observedPersonalIncome,
    ).length,
    equal = input.callerLocalReferenceIncomes.filter(
      (v) => v === input.observedPersonalIncome,
    ).length;
  return {
    observedReferenceMidrankPercentile:
      (100 * (lower + 0.5 * equal)) / input.callerLocalReferenceIncomes.length,
    strictlyLowerReferenceCount: lower,
    equalReferenceCount: equal,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerLocalReferenceIncomes: [1, 2, 2, 4],
    observedPersonalIncome: 2,
  },
  output: {
    result: {
      observedReferenceMidrankPercentile: 50,
      strictlyLowerReferenceCount: 1,
      equalReferenceCount: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/status-anxiety-local-income-rank",
  title: "Local Income Rank Status Anxiety Calculator",
  description:
    "Actual local-reference income midrank with half ties; not a status-anxiety calculation or inference of emotions from income rank. Reference cohort, units and weighting independently specified.",
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
