import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedDishwasherCycleLiters: readonly number[];
  readonly observedDishwasherCycleCounts: readonly number[];
  readonly observedRepresentedPlaceSettings: readonly number[];
  readonly observedPreRinseLiters: number;
}>;
export type Output = Readonly<{
  readonly totalObservedDishwasherAndPreRinseLiters: number;
  readonly pooledLitersPerRepresentedPlaceSetting: number;
}>;
const inputFields = [
  {
    id: "observedDishwasherCycleLiters",
    label: "Observed dishwasher cycle liters",
    kind: "numberList",
  },
  {
    id: "observedDishwasherCycleCounts",
    label: "Observed dishwasher cycle counts",
    kind: "numberList",
  },
  {
    id: "observedRepresentedPlaceSettings",
    label: "Observed represented place settings",
    kind: "numberList",
  },
  {
    id: "observedPreRinseLiters",
    label: "Observed pre rinse liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRepresentedPlaceSettings.forEach((v) =>
    positive(v, "observedRepresentedPlaceSettings"),
  );
  input.observedDishwasherCycleLiters.forEach((v) =>
    nonnegative(v, "observedDishwasherCycleLiters"),
  );
  nonnegative(input.observedPreRinseLiters, "observedPreRinseLiters");
  aligned(
    input.observedDishwasherCycleLiters,
    input.observedDishwasherCycleCounts,
    "observedDishwasherCycleLiters",
  );
  aligned(
    input.observedDishwasherCycleLiters,
    input.observedRepresentedPlaceSettings,
    "observedDishwasherCycleLiters",
  );
  input.observedDishwasherCycleCounts.forEach((v) =>
    bounded(v, "cycles", 0, 1000000),
  );
  const total =
    sum(
      input.observedDishwasherCycleLiters.map(
        (v, i) => v * input.observedDishwasherCycleCounts[i],
      ),
    ) + input.observedPreRinseLiters;
  return {
    totalObservedDishwasherAndPreRinseLiters: total,
    pooledLitersPerRepresentedPlaceSetting:
      total / sum(input.observedRepresentedPlaceSettings),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDishwasherCycleLiters: [10, 15],
  observedDishwasherCycleCounts: [2, 1],
  observedRepresentedPlaceSettings: [20, 10],
  observedPreRinseLiters: 5,
} satisfies Input;
export const exampleOutput = {
  totalObservedDishwasherAndPreRinseLiters: 40,
  pooledLitersPerRepresentedPlaceSetting: 1.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/dishwasher-water-usage",
  title: "Plumbing Dishwasher Water Usage Calculator",
  description:
    "Account actual dishwasher cycle inventory and independent pre-rinse/place-setting exposure; not laundry load, assumed appliance class or hygiene certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalObservedDishwasherAndPreRinseLiters",
      label: "Total observed dishwasher and pre rinse liters",
      kind: "number",
    },
    {
      id: "pooledLitersPerRepresentedPlaceSetting",
      label: "Pooled liters per represented place setting",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDishwasherCycleLiters:
        value.observedDishwasherCycleLiters as readonly number[],
      observedDishwasherCycleCounts:
        value.observedDishwasherCycleCounts as readonly number[],
      observedRepresentedPlaceSettings:
        value.observedRepresentedPlaceSettings as readonly number[],
      observedPreRinseLiters: value.observedPreRinseLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
