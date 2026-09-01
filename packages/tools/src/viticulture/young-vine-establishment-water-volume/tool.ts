import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  bounded,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedYoungVineCountsByZone: readonly number[];
  readonly callerMeasuredEventLitersPerVine: readonly number[];
  readonly observedEffectiveRainCreditLitersByZone: readonly number[];
  readonly callerDistributionDeliveryFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly netDeliveredEventDemandLitersByZone: readonly number[];
  readonly grossSupplyBudgetLitersByZone: readonly number[];
  readonly combinedGrossWaterBudgetLiters: number;
}>;
const inputFields = [
  {
    id: "observedYoungVineCountsByZone",
    label: "Observed young vine counts by zone",
    kind: "numberList",
  },
  {
    id: "callerMeasuredEventLitersPerVine",
    label: "Caller measured event liters per vine",
    kind: "numberList",
  },
  {
    id: "observedEffectiveRainCreditLitersByZone",
    label: "Observed effective rain credit liters by zone",
    kind: "numberList",
  },
  {
    id: "callerDistributionDeliveryFractions",
    label: "Caller distribution delivery fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerDistributionDeliveryFractions.forEach((v) =>
    positive(v, "callerDistributionDeliveryFractions"),
  );
  input.callerMeasuredEventLitersPerVine.forEach((v) =>
    nonnegative(v, "callerMeasuredEventLitersPerVine"),
  );
  input.observedEffectiveRainCreditLitersByZone.forEach((v) =>
    nonnegative(v, "observedEffectiveRainCreditLitersByZone"),
  );
  input.callerDistributionDeliveryFractions.forEach((v) =>
    fraction(v, "callerDistributionDeliveryFractions"),
  );
  aligned(
    input.observedYoungVineCountsByZone,
    input.callerMeasuredEventLitersPerVine,
    "observedYoungVineCountsByZone",
  );
  aligned(
    input.observedYoungVineCountsByZone,
    input.observedEffectiveRainCreditLitersByZone,
    "observedYoungVineCountsByZone",
  );
  aligned(
    input.observedYoungVineCountsByZone,
    input.callerDistributionDeliveryFractions,
    "observedYoungVineCountsByZone",
  );
  input.observedYoungVineCountsByZone.forEach((v) =>
    bounded(v, "vines", 0, 1000000),
  );
  const net = input.observedYoungVineCountsByZone.map((v, i) =>
      Math.max(
        0,
        v * input.callerMeasuredEventLitersPerVine[i] -
          input.observedEffectiveRainCreditLitersByZone[i],
      ),
    ),
    gross = net.map((v, i) => v / input.callerDistributionDeliveryFractions[i]);
  return {
    netDeliveredEventDemandLitersByZone: net,
    grossSupplyBudgetLitersByZone: gross,
    combinedGrossWaterBudgetLiters: sum(gross),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedYoungVineCountsByZone: [10, 20],
  callerMeasuredEventLitersPerVine: [2, 1],
  observedEffectiveRainCreditLitersByZone: [5, 5],
  callerDistributionDeliveryFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  netDeliveredEventDemandLitersByZone: [15, 15],
  grossSupplyBudgetLitersByZone: [30, 15],
  combinedGrossWaterBudgetLiters: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/young-vine-establishment-water-volume",
  title: "Young Vine Establishment Water Volume Calculator",
  description:
    "Budget actual young-vine water inventory from caller independently measured per-event demand, effective rain credits and delivery loss; not universal establishment dose, ET-based schedule or root oxygen assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "netDeliveredEventDemandLitersByZone",
      label: "Net delivered event demand liters by zone",
      kind: "numberList",
    },
    {
      id: "grossSupplyBudgetLitersByZone",
      label: "Gross supply budget liters by zone",
      kind: "numberList",
    },
    {
      id: "combinedGrossWaterBudgetLiters",
      label: "Combined gross water budget liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedYoungVineCountsByZone:
        value.observedYoungVineCountsByZone as readonly number[],
      callerMeasuredEventLitersPerVine:
        value.callerMeasuredEventLitersPerVine as readonly number[],
      observedEffectiveRainCreditLitersByZone:
        value.observedEffectiveRainCreditLitersByZone as readonly number[],
      callerDistributionDeliveryFractions:
        value.callerDistributionDeliveryFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
