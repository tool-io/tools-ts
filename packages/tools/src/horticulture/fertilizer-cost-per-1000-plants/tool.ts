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
  readonly observedFertilizerUsedGrams: readonly number[];
  readonly callerPriceMinorPerKg: readonly number[];
  readonly observedSaleablePlantCount: number;
}>;
export type Output = Readonly<{
  readonly roundedFertilizerCostsMinor: readonly number[];
  readonly totalFertilizerCostMinor: number;
  readonly normalizedCostPer1000PlantsMinor: number;
}>;
const inputFields = [
  {
    id: "observedFertilizerUsedGrams",
    label: "Observed fertilizer used grams",
    kind: "numberList",
  },
  {
    id: "callerPriceMinorPerKg",
    label: "Caller price minor per kg",
    kind: "numberList",
  },
  {
    id: "observedSaleablePlantCount",
    label: "Observed saleable plant count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedFertilizerUsedGrams,
    input.callerPriceMinorPerKg,
    "fertilizers",
  );
  input.observedFertilizerUsedGrams.forEach((v) =>
    bounded(v, "grams", 0, 1000000000),
  );
  input.callerPriceMinorPerKg.forEach((v) =>
    bounded(v, "price", 0, 1000000000),
  );
  bounded(input.observedSaleablePlantCount, "plants", 1, 1000000);
  const costs = input.observedFertilizerUsedGrams.map((v, i) =>
      weightedMinor(v, input.callerPriceMinorPerKg[i], 1000),
    ),
    total = sumMoney(costs);
  return {
    roundedFertilizerCostsMinor: costs,
    totalFertilizerCostMinor: total,
    normalizedCostPer1000PlantsMinor: weightedMinor(
      total,
      1000,
      input.observedSaleablePlantCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFertilizerUsedGrams: [1000, 500],
  callerPriceMinorPerKg: [200, 400],
  observedSaleablePlantCount: 500,
} satisfies Input;
export const exampleOutput = {
  roundedFertilizerCostsMinor: [200, 200],
  totalFertilizerCostMinor: 400,
  normalizedCostPer1000PlantsMinor: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/fertilizer-cost-per-1000-plants",
  title: "Fertilizer Cost Per 1000 Plants Calculator",
  description:
    "Account actual fertilizer use/price inventory normalized to observed saleable plants, one currency and exact per-item minor-unit rounding; no stock-solution recipe, assumed plant dosage or price prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "roundedFertilizerCostsMinor",
      label: "Rounded fertilizer costs minor",
      kind: "numberList",
    },
    {
      id: "totalFertilizerCostMinor",
      label: "Total fertilizer cost minor",
      kind: "number",
    },
    {
      id: "normalizedCostPer1000PlantsMinor",
      label: "Normalized cost per1000 plants minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFertilizerUsedGrams:
        value.observedFertilizerUsedGrams as readonly number[],
      callerPriceMinorPerKg: value.callerPriceMinorPerKg as readonly number[],
      observedSaleablePlantCount: value.observedSaleablePlantCount as number,
    }),
});
export const run = tool.execute;
export default tool;
