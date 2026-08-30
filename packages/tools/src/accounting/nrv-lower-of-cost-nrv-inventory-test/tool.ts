import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly skuUnits: readonly number[];
  readonly skuCostPerUnitMinor: readonly number[];
  readonly skuSellingPricePerUnitMinor: readonly number[];
  readonly skuCompletionAndSellingCostPerUnitMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly skuNrvPerUnitMinor: readonly number[];
  readonly skuCarryingValuesMinor: readonly number[];
  readonly totalInventoryWriteDownMinor: number;
}>;
const inputFields = [
  { id: "skuUnits", label: "Sku units", kind: "numberList" },
  {
    id: "skuCostPerUnitMinor",
    label: "Sku cost per unit minor",
    kind: "numberList",
  },
  {
    id: "skuSellingPricePerUnitMinor",
    label: "Sku selling price per unit minor",
    kind: "numberList",
  },
  {
    id: "skuCompletionAndSellingCostPerUnitMinor",
    label: "Sku completion and selling cost per unit minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.skuCostPerUnitMinor.forEach((v) => money(v, "skuCostPerUnitMinor"));
  input.skuSellingPricePerUnitMinor.forEach((v) =>
    money(v, "skuSellingPricePerUnitMinor"),
  );
  input.skuCompletionAndSellingCostPerUnitMinor.forEach((v) =>
    money(v, "skuCompletionAndSellingCostPerUnitMinor"),
  );
  aligned(input.skuUnits, input.skuCostPerUnitMinor, "skuUnits");
  aligned(input.skuUnits, input.skuSellingPricePerUnitMinor, "skuUnits");
  aligned(
    input.skuUnits,
    input.skuCompletionAndSellingCostPerUnitMinor,
    "skuUnits",
  );
  input.skuUnits.forEach((v) => bounded(v, "units", 0, 1000000));
  const nrv = input.skuSellingPricePerUnitMinor.map((v, i) =>
      integer(v - input.skuCompletionAndSellingCostPerUnitMinor[i], "nrv"),
    ),
    carrying = nrv.map((v, i) =>
      money(
        input.skuUnits[i] *
          Math.max(0, Math.min(v, input.skuCostPerUnitMinor[i])),
        "carrying",
      ),
    ),
    old = sumMoney(
      input.skuUnits.map((v, i) =>
        money(v * input.skuCostPerUnitMinor[i], "cost"),
      ),
    );
  return {
    skuNrvPerUnitMinor: nrv,
    skuCarryingValuesMinor: carrying,
    totalInventoryWriteDownMinor: old - sumMoney(carrying),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  skuUnits: [2, 3],
  skuCostPerUnitMinor: [10, 20],
  skuSellingPricePerUnitMinor: [12, 18],
  skuCompletionAndSellingCostPerUnitMinor: [3, 3],
} satisfies Input;
export const exampleOutput = {
  skuNrvPerUnitMinor: [9, 15],
  skuCarryingValuesMinor: [18, 45],
  totalInventoryWriteDownMinor: 17,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/nrv-lower-of-cost-nrv-inventory-test",
  title: "NRV Lower Of Cost NRV Inventory Test Tool",
  description:
    "Audit itemwise cost versus caller selling-price-less-completion/selling-cost NRV, retaining negative unit NRV but flooring asset carrying value at zero; any additional disposal obligation is outside this inventory-only model.",
  inputs: inputFields,
  outputs: [
    {
      id: "skuNrvPerUnitMinor",
      label: "Sku nrv per unit minor",
      kind: "numberList",
    },
    {
      id: "skuCarryingValuesMinor",
      label: "Sku carrying values minor",
      kind: "numberList",
    },
    {
      id: "totalInventoryWriteDownMinor",
      label: "Total inventory write down minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      skuUnits: value.skuUnits as readonly number[],
      skuCostPerUnitMinor: value.skuCostPerUnitMinor as readonly number[],
      skuSellingPricePerUnitMinor:
        value.skuSellingPricePerUnitMinor as readonly number[],
      skuCompletionAndSellingCostPerUnitMinor:
        value.skuCompletionAndSellingCostPerUnitMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
