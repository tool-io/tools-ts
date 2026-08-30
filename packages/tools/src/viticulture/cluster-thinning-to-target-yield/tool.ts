import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedClustersPerVine: readonly number[];
  readonly forecastMatureClusterMassesKg: readonly number[];
  readonly callerMaximumFruitMassKgPerVine: readonly number[];
}>;
export type Output = Readonly<{
  readonly maximumWholeRetainedClustersByVine: readonly number[];
  readonly minimumClusterCountReductionUnderBudget: readonly number[];
  readonly modeledRetainedFruitMassesKg: readonly number[];
}>;
const inputFields = [
  {
    id: "observedClustersPerVine",
    label: "Observed clusters per vine",
    kind: "numberList",
  },
  {
    id: "forecastMatureClusterMassesKg",
    label: "Forecast mature cluster masses kg",
    kind: "numberList",
  },
  {
    id: "callerMaximumFruitMassKgPerVine",
    label: "Caller maximum fruit mass kg per vine",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.forecastMatureClusterMassesKg.forEach((v) =>
    positive(v, "forecastMatureClusterMassesKg"),
  );
  input.callerMaximumFruitMassKgPerVine.forEach((v) =>
    nonnegative(v, "callerMaximumFruitMassKgPerVine"),
  );
  input.observedClustersPerVine.forEach((v) =>
    count(v, "observedClustersPerVine"),
  );
  aligned(
    input.observedClustersPerVine,
    input.forecastMatureClusterMassesKg,
    "observedClustersPerVine",
  );
  aligned(
    input.observedClustersPerVine,
    input.callerMaximumFruitMassKgPerVine,
    "observedClustersPerVine",
  );
  const keep = input.observedClustersPerVine.map((v, i) =>
    Math.min(
      v,
      Math.floor(
        input.callerMaximumFruitMassKgPerVine[i] /
          input.forecastMatureClusterMassesKg[i],
      ),
    ),
  );
  return {
    maximumWholeRetainedClustersByVine: keep,
    minimumClusterCountReductionUnderBudget: keep.map(
      (v, i) => input.observedClustersPerVine[i] - v,
    ),
    modeledRetainedFruitMassesKg: keep.map(
      (v, i) => v * input.forecastMatureClusterMassesKg[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedClustersPerVine: [10, 20],
  forecastMatureClusterMassesKg: [0.2, 0.1],
  callerMaximumFruitMassKgPerVine: [1, 1],
} satisfies Input;
export const exampleOutput = {
  maximumWholeRetainedClustersByVine: [5, 10],
  minimumClusterCountReductionUnderBudget: [5, 10],
  modeledRetainedFruitMassesKg: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/cluster-thinning-to-target-yield",
  title: "Cluster Thinning To Target Yield",
  description:
    "Audit whole-cluster retention consistent with caller fruit-mass ceilings and independently forecast mature cluster masses; no validated optimum/thinning advice and forecast uncertainty is not silently measured yield.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumWholeRetainedClustersByVine",
      label: "Maximum whole retained clusters by vine",
      kind: "numberList",
    },
    {
      id: "minimumClusterCountReductionUnderBudget",
      label: "Minimum cluster count reduction under budget",
      kind: "numberList",
    },
    {
      id: "modeledRetainedFruitMassesKg",
      label: "Modeled retained fruit masses kg",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedClustersPerVine:
        value.observedClustersPerVine as readonly number[],
      forecastMatureClusterMassesKg:
        value.forecastMatureClusterMassesKg as readonly number[],
      callerMaximumFruitMassKgPerVine:
        value.callerMaximumFruitMassKgPerVine as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
