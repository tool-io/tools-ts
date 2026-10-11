import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly intercompanySales: number;
  readonly unrealizedInventoryProfit: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "intercompanySales", label: "Intercompany sales", kind: "number" },
  {
    id: "unrealizedInventoryProfit",
    label: "Unrealized inventory profit",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.intercompanySales, "sales");
  angle(
    i.unrealizedInventoryProfit,
    "unrealized profit",
    0,
    i.intercompanySales,
  );
  return {
    debitSales: i.intercompanySales,
    creditCostOfSales: i.intercompanySales,
    debitCostOfSalesForUnrealized: i.unrealizedInventoryProfit,
    creditInventory: i.unrealizedInventoryProfit,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { intercompanySales: 100, unrealizedInventoryProfit: 20 },
  output: {
    result: {
      debitSales: 100,
      creditCostOfSales: 100,
      debitCostOfSalesForUnrealized: 20,
      creditInventory: 20,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/intercompany-sales-elimination-entry",
  title: "Intercompany Sales Elimination Entry Builder",
  description:
    "Illustrative separate consolidation elimination amounts for fully consolidated intercompany sales and caller established ending-inventory unrealized profit; tax/NCI/upstream allocations omitted.",
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
          debitSales: { type: "number" },
          creditCostOfSales: { type: "number" },
          debitCostOfSalesForUnrealized: { type: "number" },
          creditInventory: { type: "number" },
        },
        required: [
          "debitSales",
          "creditCostOfSales",
          "debitCostOfSalesForUnrealized",
          "creditInventory",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
