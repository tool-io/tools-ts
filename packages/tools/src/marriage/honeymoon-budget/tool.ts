import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  sumMoney,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualLineItemIds: readonly string[];
  readonly callerEstablishedLineItemCostsMinorUnits: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLineItemIds",
    label: "Actual line item ids",
    kind: "stringList",
  },
  {
    id: "callerEstablishedLineItemCostsMinorUnits",
    label: "Caller established line item costs minor units",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.actualLineItemIds, "items");
  aligned(
    input.actualLineItemIds,
    input.callerEstablishedLineItemCostsMinorUnits,
    "costs",
  );
  return {
    conditionalSameCurrencyBudgetMinorUnits: sumMoney(
      input.callerEstablishedLineItemCostsMinorUnits,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLineItemIds: ["a", "b"],
    callerEstablishedLineItemCostsMinorUnits: [100, 200],
  },
  output: { result: { conditionalSameCurrencyBudgetMinorUnits: 300 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/honeymoon-budget",
  title: "Honeymoon Budget Calculator",
  description:
    "Actual independently established unique honeymoon budget line items summed exactly in nonnegative safe-integer minor-units of ONEcaller currency, no forex, tax estimate or quote guarantee.",
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
