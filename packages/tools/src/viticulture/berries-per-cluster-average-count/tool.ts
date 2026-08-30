import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned, mean } from "../shared.js";
export type Input = Readonly<{
  readonly matureBerryCountsByCluster: readonly number[];
  readonly smallBerryCountsByCluster: readonly number[];
  readonly abortedFlowerCountsByCluster: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedBerriesPerCluster: readonly number[];
  readonly meanObservedBerriesPerCluster: number;
  readonly flowerOpportunityFruitSetFraction: number;
}>;
const inputFields = [
  {
    id: "matureBerryCountsByCluster",
    label: "Mature berry counts by cluster",
    kind: "numberList",
  },
  {
    id: "smallBerryCountsByCluster",
    label: "Small berry counts by cluster",
    kind: "numberList",
  },
  {
    id: "abortedFlowerCountsByCluster",
    label: "Aborted flower counts by cluster",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matureBerryCountsByCluster.forEach((v) =>
    count(v, "matureBerryCountsByCluster"),
  );
  input.smallBerryCountsByCluster.forEach((v) =>
    count(v, "smallBerryCountsByCluster"),
  );
  input.abortedFlowerCountsByCluster.forEach((v) =>
    count(v, "abortedFlowerCountsByCluster"),
  );
  aligned(
    input.matureBerryCountsByCluster,
    input.smallBerryCountsByCluster,
    "matureBerryCountsByCluster",
  );
  aligned(
    input.matureBerryCountsByCluster,
    input.abortedFlowerCountsByCluster,
    "matureBerryCountsByCluster",
  );
  const observedBerriesPerCluster = input.matureBerryCountsByCluster.map(
      (v, i) => v + input.smallBerryCountsByCluster[i],
    ),
    berries = observedBerriesPerCluster.reduce((a, b) => a + b, 0),
    total = count(
      berries + input.abortedFlowerCountsByCluster.reduce((a, b) => a + b, 0),
      "flowerOpportunities",
      1,
    );
  return {
    observedBerriesPerCluster,
    meanObservedBerriesPerCluster: mean(observedBerriesPerCluster),
    flowerOpportunityFruitSetFraction: berries / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  matureBerryCountsByCluster: [10, 20],
  smallBerryCountsByCluster: [2, 4],
  abortedFlowerCountsByCluster: [3, 6],
} satisfies Input;
export const exampleOutput = {
  observedBerriesPerCluster: [12, 24],
  meanObservedBerriesPerCluster: 18,
  flowerOpportunityFruitSetFraction: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/berries-per-cluster-average-count",
  title: "Berries Per Cluster Average Count",
  description:
    "Count all observed mature/small berries by cluster and retain abortion-opportunity fruit-set denominator; no inferred original flowers from surviving berries or disease diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBerriesPerCluster",
      label: "Observed berries per cluster",
      kind: "numberList",
    },
    {
      id: "meanObservedBerriesPerCluster",
      label: "Mean observed berries per cluster",
      kind: "number",
    },
    {
      id: "flowerOpportunityFruitSetFraction",
      label: "Flower opportunity fruit set fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      matureBerryCountsByCluster:
        value.matureBerryCountsByCluster as readonly number[],
      smallBerryCountsByCluster:
        value.smallBerryCountsByCluster as readonly number[],
      abortedFlowerCountsByCluster:
        value.abortedFlowerCountsByCluster as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
