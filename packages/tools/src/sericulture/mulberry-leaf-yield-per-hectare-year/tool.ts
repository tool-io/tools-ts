import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly harvestFreshLeafMassesKg: readonly number[];
  readonly harvestDryMatterFractions: readonly number[];
  readonly productiveAreaHectares: number;
  readonly observationDays: number;
  readonly annualizationDays: number;
}>;
export type Output = Readonly<{
  readonly observedFreshLeafKgPerHectare: number;
  readonly observedDryLeafKgPerHectare: number;
  readonly annualizedFreshLeafKgPerHectare: number;
  readonly annualizedDryLeafKgPerHectare: number;
}>;
const inputFields = [
  {
    id: "harvestFreshLeafMassesKg",
    label: "Harvest fresh leaf masses kg",
    kind: "numberList",
  },
  {
    id: "harvestDryMatterFractions",
    label: "Harvest dry matter fractions",
    kind: "numberList",
  },
  {
    id: "productiveAreaHectares",
    label: "Productive area hectares",
    kind: "number",
  },
  { id: "observationDays", label: "Observation days", kind: "number" },
  { id: "annualizationDays", label: "Annualization days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.productiveAreaHectares, "productiveAreaHectares");
  positive(input.observationDays, "observationDays");
  positive(input.annualizationDays, "annualizationDays");
  input.harvestFreshLeafMassesKg.forEach((v) =>
    nonnegative(v, "harvestFreshLeafMassesKg"),
  );
  input.harvestDryMatterFractions.forEach((v) =>
    fraction(v, "harvestDryMatterFractions"),
  );
  aligned(
    input.harvestFreshLeafMassesKg,
    input.harvestDryMatterFractions,
    "harvestFreshLeafMassesKg",
  );
  const observedFreshLeafKgPerHectare =
      input.harvestFreshLeafMassesKg.reduce((a, b) => a + b, 0) /
      input.productiveAreaHectares,
    observedDryLeafKgPerHectare =
      input.harvestFreshLeafMassesKg.reduce(
        (s, v, i) => s + v * input.harvestDryMatterFractions[i],
        0,
      ) / input.productiveAreaHectares,
    scale = input.annualizationDays / input.observationDays;
  return {
    observedFreshLeafKgPerHectare,
    observedDryLeafKgPerHectare,
    annualizedFreshLeafKgPerHectare: observedFreshLeafKgPerHectare * scale,
    annualizedDryLeafKgPerHectare: observedDryLeafKgPerHectare * scale,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  harvestFreshLeafMassesKg: [100, 200],
  harvestDryMatterFractions: [0.2, 0.3],
  productiveAreaHectares: 0.5,
  observationDays: 180,
  annualizationDays: 360,
} satisfies Input;
export const exampleOutput = {
  observedFreshLeafKgPerHectare: 600,
  observedDryLeafKgPerHectare: 160,
  annualizedFreshLeafKgPerHectare: 1200,
  annualizedDryLeafKgPerHectare: 320,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/mulberry-leaf-yield-per-hectare-year",
  title: "Mulberry Leaf Yield Per Hectare Year",
  description:
    "Normalize repeated mulberry harvests on fresh/dry bases and explicitly annualize the observation span; constant productivity annualization is a scenario, not a seasonal yield forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFreshLeafKgPerHectare",
      label: "Observed fresh leaf kg per hectare",
      kind: "number",
    },
    {
      id: "observedDryLeafKgPerHectare",
      label: "Observed dry leaf kg per hectare",
      kind: "number",
    },
    {
      id: "annualizedFreshLeafKgPerHectare",
      label: "Annualized fresh leaf kg per hectare",
      kind: "number",
    },
    {
      id: "annualizedDryLeafKgPerHectare",
      label: "Annualized dry leaf kg per hectare",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      harvestFreshLeafMassesKg:
        value.harvestFreshLeafMassesKg as readonly number[],
      harvestDryMatterFractions:
        value.harvestDryMatterFractions as readonly number[],
      productiveAreaHectares: value.productiveAreaHectares as number,
      observationDays: value.observationDays as number,
      annualizationDays: value.annualizationDays as number,
    }),
});
export const run = tool.execute;
export default tool;
