import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sumMoney,
  weightedMinor,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly ingredientUsedMilliliters: readonly number[];
  readonly callerIngredientPriceMinorPerLiter: readonly number[];
  readonly saleableFilledPotCount: number;
  readonly handlingCostMinor: number;
}>;
export type Output = Readonly<{
  readonly roundedIngredientCostsMinor: readonly number[];
  readonly totalFilledPotBatchCostMinor: number;
  readonly roundedCostPerSaleablePotMinor: number;
}>;
const inputFields = [
  {
    id: "ingredientUsedMilliliters",
    label: "Ingredient used milliliters",
    kind: "numberList",
  },
  {
    id: "callerIngredientPriceMinorPerLiter",
    label: "Caller ingredient price minor per liter",
    kind: "numberList",
  },
  {
    id: "saleableFilledPotCount",
    label: "Saleable filled pot count",
    kind: "number",
  },
  { id: "handlingCostMinor", label: "Handling cost minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.ingredientUsedMilliliters,
    input.callerIngredientPriceMinorPerLiter,
    "ingredients",
  );
  input.ingredientUsedMilliliters.forEach((v) =>
    bounded(v, "milliliters", 0, 1000000000),
  );
  input.callerIngredientPriceMinorPerLiter.forEach((v) =>
    bounded(v, "price", 0, 1000000000),
  );
  bounded(input.saleableFilledPotCount, "pots", 1, 1000000);
  bounded(input.handlingCostMinor, "handling", 0, 1000000000);
  const costs = input.ingredientUsedMilliliters.map((v, i) =>
      weightedMinor(v, input.callerIngredientPriceMinorPerLiter[i], 1000),
    ),
    total = sumMoney([...costs, input.handlingCostMinor]);
  return {
    roundedIngredientCostsMinor: costs,
    totalFilledPotBatchCostMinor: total,
    roundedCostPerSaleablePotMinor: weightedMinor(
      total,
      1,
      input.saleableFilledPotCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ingredientUsedMilliliters: [1000, 500],
  callerIngredientPriceMinorPerLiter: [200, 400],
  saleableFilledPotCount: 10,
  handlingCostMinor: 50,
} satisfies Input;
export const exampleOutput = {
  roundedIngredientCostsMinor: [200, 200],
  totalFilledPotBatchCostMinor: 450,
  roundedCostPerSaleablePotMinor: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/substrate-cost-per-pot-filled",
  title: "Substrate Cost Per Pot Filled Calculator",
  description:
    "Reconcile actual ingredient-volume/price ledger plus handling over observed saleable pots; exact rational nearest minor-unit rounding per ingredient then per pot in one currency, not assumed pot fill or generic blend price.",
  inputs: inputFields,
  outputs: [
    {
      id: "roundedIngredientCostsMinor",
      label: "Rounded ingredient costs minor",
      kind: "numberList",
    },
    {
      id: "totalFilledPotBatchCostMinor",
      label: "Total filled pot batch cost minor",
      kind: "number",
    },
    {
      id: "roundedCostPerSaleablePotMinor",
      label: "Rounded cost per saleable pot minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ingredientUsedMilliliters:
        value.ingredientUsedMilliliters as readonly number[],
      callerIngredientPriceMinorPerLiter:
        value.callerIngredientPriceMinorPerLiter as readonly number[],
      saleableFilledPotCount: value.saleableFilledPotCount as number,
      handlingCostMinor: value.handlingCostMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
