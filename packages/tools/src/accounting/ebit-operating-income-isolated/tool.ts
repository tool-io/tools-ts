import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly revenue: number;
  readonly costOfSales: number;
  readonly operatingExpenses: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "revenue", label: "Revenue", kind: "number" },
  { id: "costOfSales", label: "Cost of sales", kind: "number" },
  { id: "operatingExpenses", label: "Operating expenses", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  [i.revenue, i.costOfSales, i.operatingExpenses].forEach((v) =>
    nonnegative(v, "component"),
  );
  return { operatingIncome: i.revenue - i.costOfSales - i.operatingExpenses };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { revenue: 200, costOfSales: 100, operatingExpenses: 50 },
  output: { result: { operatingIncome: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/ebit-operating-income-isolated",
  title: "EBIT Operating Income Isolated Calculator",
  description:
    "Isolate observed operating income from revenue, cost of sales and operating expenses; nonoperating EBIT reconciliation omitted.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { operatingIncome: { type: "number" } },
        required: ["operatingIncome"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
