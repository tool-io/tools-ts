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
  readonly actualPresentValuedBenefitAmounts: readonly number[];
  readonly actualPresentValuedCostAmounts: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualPresentValuedBenefitAmounts",
    label: "Actual present valued benefit amounts",
    kind: "numberList",
  },
  {
    id: "actualPresentValuedCostAmounts",
    label: "Actual present valued cost amounts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!input.actualPresentValuedBenefitAmounts.length)
    simpleError(
      "actualPresentValuedBenefitAmounts",
      "Actual nonempty observations.",
    );
  input.actualPresentValuedBenefitAmounts.forEach((v) =>
    nonnegative(v, "actualPresentValuedBenefitAmounts"),
  );
  if (!input.actualPresentValuedCostAmounts.length)
    simpleError(
      "actualPresentValuedCostAmounts",
      "Actual nonempty observations.",
    );
  input.actualPresentValuedCostAmounts.forEach((v) =>
    nonnegative(v, "actualPresentValuedCostAmounts"),
  );
  positive(sum(input.actualPresentValuedCostAmounts), "costtotal");
  return {
    value:
      sum(input.actualPresentValuedBenefitAmounts) /
      sum(input.actualPresentValuedCostAmounts),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPresentValuedBenefitAmounts: [2, 4],
    actualPresentValuedCostAmounts: [1, 2],
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/benefit-cost-ratio",
  title: "Benefit Cost Ratio Aquaculture Calculator",
  description:
    "Actual already independently present-valued benefits/costs BCR, complete same currency/timing/discount ledger. Not undiscounted project forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
