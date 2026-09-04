import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  money,
  sumMoney,
  roundMinor,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedDurableProductRevenueMinor: number;
  readonly observedRecurringConsumableRevenueMinor: number;
}>;
export type Output = Readonly<{
  readonly consumableRevenueBasisPoints: number;
  readonly observedTotalRevenueMinor: number;
}>;
const inputFields = [
  {
    id: "observedDurableProductRevenueMinor",
    label: "Observed durable product revenue minor",
    kind: "number",
  },
  {
    id: "observedRecurringConsumableRevenueMinor",
    label: "Observed recurring consumable revenue minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedDurableProductRevenueMinor, "durable revenue");
  money(input.observedRecurringConsumableRevenueMinor, "consumable revenue");
  const t = positive(
    sumMoney([
      input.observedDurableProductRevenueMinor,
      input.observedRecurringConsumableRevenueMinor,
    ]),
    "total revenue",
  );
  return {
    consumableRevenueBasisPoints: roundMinor(
      BigInt(input.observedRecurringConsumableRevenueMinor) * 10000n,
      BigInt(t),
    ),
    observedTotalRevenueMinor: t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDurableProductRevenueMinor: 100,
  observedRecurringConsumableRevenueMinor: 300,
} satisfies Input;
export const exampleOutput = {
  consumableRevenueBasisPoints: 7500,
  observedTotalRevenueMinor: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/razor-blade-model-recurring-consumable-split-lookup",
  title: "Razor Blade Model Recurring Consumable Split Lookup",
  description:
    "Actual durable-vs-recurring consumable sales split on same-period exact minor units; repeat purchase not inferred from product label. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "consumableRevenueBasisPoints",
      label: "Consumable revenue basis points",
      kind: "number",
    },
    {
      id: "observedTotalRevenueMinor",
      label: "Observed total revenue minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDurableProductRevenueMinor:
        value.observedDurableProductRevenueMinor as number,
      observedRecurringConsumableRevenueMinor:
        value.observedRecurringConsumableRevenueMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
