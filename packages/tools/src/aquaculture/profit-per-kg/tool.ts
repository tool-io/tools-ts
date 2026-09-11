import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  money,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualSalesRevenueMinorUnits: number;
  readonly actualTotalAttributableCostMinorUnits: number;
  readonly actualSoldProductMassKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSalesRevenueMinorUnits",
    label: "Actual sales revenue minor units",
    kind: "number",
  },
  {
    id: "actualTotalAttributableCostMinorUnits",
    label: "Actual total attributable cost minor units",
    kind: "number",
  },
  {
    id: "actualSoldProductMassKg",
    label: "Actual sold product mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualSalesRevenueMinorUnits,
    "actualSalesRevenueMinorUnits",
  );
  nonnegative(
    input.actualTotalAttributableCostMinorUnits,
    "actualTotalAttributableCostMinorUnits",
  );
  positive(input.actualSoldProductMassKg, "actualSoldProductMassKg");
  money(input.actualSalesRevenueMinorUnits, "revenue");
  money(input.actualTotalAttributableCostMinorUnits, "cost");
  return {
    value:
      (input.actualSalesRevenueMinorUnits -
        input.actualTotalAttributableCostMinorUnits) /
      input.actualSoldProductMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSalesRevenueMinorUnits: 20,
    actualTotalAttributableCostMinorUnits: 10,
    actualSoldProductMassKg: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/profit-per-kg",
  title: "Profit Per Kg Calculator",
  description:
    "Actual signed profit minor units perkgfrom complete independently attributable same currency cost/revenue ledger, no feed-only cost or validated profit forecast.",
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
