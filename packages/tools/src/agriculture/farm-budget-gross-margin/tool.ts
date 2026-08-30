import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly soldProductQuantities: readonly number[];
  readonly netUnitSalePrices: readonly number[];
  readonly variableCostItems: readonly number[];
  readonly productionAreaHa: number;
}>;
export type Output = Readonly<{
  readonly totalEnterpriseRevenue: number;
  readonly totalVariableEnterpriseCost: number;
  readonly enterpriseGrossMargin: number;
  readonly grossMarginPerHa: number;
}>;
const inputFields = [
  {
    id: "soldProductQuantities",
    label: "Sold product quantities",
    kind: "numberList",
  },
  {
    id: "netUnitSalePrices",
    label: "Net unit sale prices",
    kind: "numberList",
  },
  { id: "variableCostItems", label: "Variable cost items", kind: "numberList" },
  { id: "productionAreaHa", label: "Production area ha", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.productionAreaHa, "productionAreaHa");
  input.soldProductQuantities.forEach((v) =>
    nonnegative(v, "soldProductQuantities"),
  );
  input.netUnitSalePrices.forEach((v) => nonnegative(v, "netUnitSalePrices"));
  input.variableCostItems.forEach((v) => nonnegative(v, "variableCostItems"));
  aligned(
    input.soldProductQuantities,
    input.netUnitSalePrices,
    "soldProductQuantities",
  );
  const totalEnterpriseRevenue = input.soldProductQuantities.reduce(
      (s, v, i) => s + v * input.netUnitSalePrices[i],
      0,
    ),
    totalVariableEnterpriseCost = input.variableCostItems.reduce(
      (a, b) => a + b,
      0,
    ),
    enterpriseGrossMargin =
      totalEnterpriseRevenue - totalVariableEnterpriseCost;
  return {
    totalEnterpriseRevenue,
    totalVariableEnterpriseCost,
    enterpriseGrossMargin,
    grossMarginPerHa: enterpriseGrossMargin / input.productionAreaHa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  soldProductQuantities: [10, 20],
  netUnitSalePrices: [2, 3],
  variableCostItems: [10, 20],
  productionAreaHa: 2,
} satisfies Input;
export const exampleOutput = {
  totalEnterpriseRevenue: 80,
  totalVariableEnterpriseCost: 30,
  enterpriseGrossMargin: 50,
  grossMarginPerHa: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/farm-budget-gross-margin",
  title: "Agriculture Farm Budget Gross Margin",
  description:
    "Account explicit farm sold-product lines and variable cost items into signed enterprise/per-area gross margin; excludes fixed overhead, financing and unsold inventory, not guaranteed profitability.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalEnterpriseRevenue",
      label: "Total enterprise revenue",
      kind: "number",
    },
    {
      id: "totalVariableEnterpriseCost",
      label: "Total variable enterprise cost",
      kind: "number",
    },
    {
      id: "enterpriseGrossMargin",
      label: "Enterprise gross margin",
      kind: "number",
    },
    { id: "grossMarginPerHa", label: "Gross margin per ha", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      soldProductQuantities: value.soldProductQuantities as readonly number[],
      netUnitSalePrices: value.netUnitSalePrices as readonly number[],
      variableCostItems: value.variableCostItems as readonly number[],
      productionAreaHa: value.productionAreaHa as number,
    }),
});
export const run = tool.execute;
export default tool;
