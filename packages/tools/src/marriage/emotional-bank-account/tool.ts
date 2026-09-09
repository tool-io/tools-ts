import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentPositiveInteractionWeights: readonly number[];
  readonly callerIndependentNegativeInteractionWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentPositiveInteractionWeights",
    label: "Caller independent positive interaction weights",
    kind: "numberList",
  },
  {
    id: "callerIndependentNegativeInteractionWeights",
    label: "Caller independent negative interaction weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerIndependentPositiveInteractionWeights,
    input.callerIndependentNegativeInteractionWeights,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "customweight")));
  return {
    signedCustomInteractionLedgerBalance:
      sum(input.callerIndependentPositiveInteractionWeights) -
      sum(input.callerIndependentNegativeInteractionWeights),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentPositiveInteractionWeights: [2, 3],
    callerIndependentNegativeInteractionWeights: [1, 5],
  },
  output: { result: { signedCustomInteractionLedgerBalance: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/emotional-bank-account",
  title: "Emotional Bank Account Calculator",
  description:
    "Explicit custom nonmonetary positive-minus-negative interaction weights, not a validated emotional bank, relationship prognosis or required psychological exchange rate.",
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
