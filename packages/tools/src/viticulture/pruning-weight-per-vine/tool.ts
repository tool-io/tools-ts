import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly pruningFreshMassesKgBySample: readonly number[];
  readonly sampledVineCounts: readonly number[];
  readonly sampleWoodDryMatterFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedFreshPruningKgPerVineBySample: readonly number[];
  readonly pooledDryPruningKgPerVine: number;
  readonly pooledFreshPruningKgPerVine: number;
}>;
const inputFields = [
  {
    id: "pruningFreshMassesKgBySample",
    label: "Pruning fresh masses kg by sample",
    kind: "numberList",
  },
  { id: "sampledVineCounts", label: "Sampled vine counts", kind: "numberList" },
  {
    id: "sampleWoodDryMatterFractions",
    label: "Sample wood dry matter fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampledVineCounts.forEach((v) => positive(v, "sampledVineCounts"));
  input.pruningFreshMassesKgBySample.forEach((v) =>
    nonnegative(v, "pruningFreshMassesKgBySample"),
  );
  input.sampleWoodDryMatterFractions.forEach((v) =>
    fraction(v, "sampleWoodDryMatterFractions"),
  );
  input.sampledVineCounts.forEach((v) => count(v, "sampledVineCounts"));
  aligned(
    input.pruningFreshMassesKgBySample,
    input.sampledVineCounts,
    "pruningFreshMassesKgBySample",
  );
  aligned(
    input.pruningFreshMassesKgBySample,
    input.sampleWoodDryMatterFractions,
    "pruningFreshMassesKgBySample",
  );
  const vines = input.sampledVineCounts.reduce((a, b) => a + b, 0);
  return {
    observedFreshPruningKgPerVineBySample:
      input.pruningFreshMassesKgBySample.map(
        (v, i) => v / input.sampledVineCounts[i],
      ),
    pooledDryPruningKgPerVine:
      input.pruningFreshMassesKgBySample.reduce(
        (s, v, i) => s + v * input.sampleWoodDryMatterFractions[i],
        0,
      ) / vines,
    pooledFreshPruningKgPerVine:
      input.pruningFreshMassesKgBySample.reduce((a, b) => a + b, 0) / vines,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pruningFreshMassesKgBySample: [10, 20],
  sampledVineCounts: [10, 20],
  sampleWoodDryMatterFractions: [0.5, 0.25],
} satisfies Input;
export const exampleOutput = {
  observedFreshPruningKgPerVineBySample: [1, 1],
  pooledDryPruningKgPerVine: 0.3333333333333333,
  pooledFreshPruningKgPerVine: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/pruning-weight-per-vine",
  title: "Pruning Weight Per Vine",
  description:
    "Pool actual pruning inventories by sampled vine counts while explicitly separating fresh/dry bases; not simple unweighted sample means, wood nutrient content or vine vigor diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFreshPruningKgPerVineBySample",
      label: "Observed fresh pruning kg per vine by sample",
      kind: "numberList",
    },
    {
      id: "pooledDryPruningKgPerVine",
      label: "Pooled dry pruning kg per vine",
      kind: "number",
    },
    {
      id: "pooledFreshPruningKgPerVine",
      label: "Pooled fresh pruning kg per vine",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pruningFreshMassesKgBySample:
        value.pruningFreshMassesKgBySample as readonly number[],
      sampledVineCounts: value.sampledVineCounts as readonly number[],
      sampleWoodDryMatterFractions:
        value.sampleWoodDryMatterFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
