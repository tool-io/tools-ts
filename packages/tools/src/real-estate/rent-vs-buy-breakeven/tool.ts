import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCumulativeRentCostsByPeriod: readonly number[];
  readonly actualCumulativeBuyCostsByPeriod: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCumulativeRentCostsByPeriod",
    label: "Actual cumulative rent costs by period",
    kind: "numberList",
  },
  {
    id: "actualCumulativeBuyCostsByPeriod",
    label: "Actual cumulative buy costs by period",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualCumulativeRentCostsByPeriod,
    input.actualCumulativeBuyCostsByPeriod,
    "periods",
  );
  const a = input.actualCumulativeRentCostsByPeriod.map(
    (v, i) => v - input.actualCumulativeBuyCostsByPeriod[i],
  );
  return {
    firstObservedBuyNotMoreCostlyPeriodIndex: a.findIndex((v) => v >= 0),
    observedRentMinusBuyCostDifferences: a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCumulativeRentCostsByPeriod: [10, 20, 30],
    actualCumulativeBuyCostsByPeriod: [15, 20, 25],
  },
  output: {
    result: {
      firstObservedBuyNotMoreCostlyPeriodIndex: 1,
      observedRentMinusBuyCostDifferences: [-5, 0, 5],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/rent-vs-buy-breakeven",
  title: "Rent vs Buy Breakeven Calculator",
  description:
    "Actual independently modeled cumulative rent/buy cost vectors earliest observed buy\u2264rent index,\u22121if none. No linear breakeven forecast, housing choice advice or invented taxes/appreciation.",
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
