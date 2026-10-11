import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly contractPrice: number;
  readonly estimatedTotalCost: number;
  readonly costIncurred: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "contractPrice", label: "Contract price", kind: "number" },
  { id: "estimatedTotalCost", label: "Estimated total cost", kind: "number" },
  { id: "costIncurred", label: "Cost incurred", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.contractPrice, "price");
  positive(i.estimatedTotalCost, "cost");
  angle(i.costIncurred, "incurred", 0, i.estimatedTotalCost);
  const totalProfit = i.contractPrice - i.estimatedTotalCost,
    pocProfit = (totalProfit * i.costIncurred) / i.estimatedTotalCost;
  return {
    conditionalCostToCostProfit: pocProfit,
    conditionalCompletedContractProfit:
      i.costIncurred === i.estimatedTotalCost ? totalProfit : 0,
    profitTimingDifference:
      i.costIncurred === i.estimatedTotalCost ? 0 : pocProfit,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { contractPrice: 200, estimatedTotalCost: 100, costIncurred: 50 },
  output: {
    result: {
      conditionalCostToCostProfit: 50,
      conditionalCompletedContractProfit: 0,
      profitTimingDifference: 50,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/completed-contract-vs-poc-deferred-profit-checker",
  title: "Completed Contract vs POC Deferred Profit Checker",
  description:
    "Illustrative cost-to-cost versus completed-contract profit timing; does not decide method eligibility or apply loss provisions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalCostToCostProfit: { type: "number" },
          conditionalCompletedContractProfit: { type: "number" },
          profitTimingDifference: { type: "number" },
        },
        required: [
          "conditionalCostToCostProfit",
          "conditionalCompletedContractProfit",
          "profitTimingDifference",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
