import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  giniValue,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly matchedBeforeTaxIncomes: readonly number[];
  readonly matchedAfterTaxIncomes: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "matchedBeforeTaxIncomes",
    label: "Matched before tax incomes",
    kind: "numberList",
  },
  {
    id: "matchedAfterTaxIncomes",
    label: "Matched after tax incomes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  aligned(
    input.matchedBeforeTaxIncomes,
    input.matchedAfterTaxIncomes,
    "households",
  );
  return {
    observedReynoldsSmolenskyDifference:
      giniValue(input.matchedBeforeTaxIncomes) -
      giniValue(input.matchedAfterTaxIncomes),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { matchedBeforeTaxIncomes: [1, 3], matchedAfterTaxIncomes: [2, 2] },
  output: { result: { observedReynoldsSmolenskyDifference: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/reynolds-smolensky-redistribution-effect",
  title: "Reynolds-Smolensky Redistribution Effect Calculator",
  description:
    "Actual matched sample pre/post tax Gini difference, retaining negative redistribution. Does not establish causal policy effect, reranking decomposition or legal tax liability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { observedReynoldsSmolenskyDifference: { type: "number" } },
        required: ["observedReynoldsSmolenskyDifference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
