import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedBurstShootsByBudPosition: readonly number[];
  readonly observedClustersOnThoseShoots: readonly number[];
  readonly observedRetainedBudCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly clustersPerObservedBurstShootByPosition: readonly number[];
  readonly pooledClustersPerObservedBurstShoot: number;
  readonly observedBudBurstFractionsByPosition: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBurstShootsByBudPosition",
    label: "Observed burst shoots by bud position",
    kind: "numberList",
  },
  {
    id: "observedClustersOnThoseShoots",
    label: "Observed clusters on those shoots",
    kind: "numberList",
  },
  {
    id: "observedRetainedBudCounts",
    label: "Observed retained bud counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedBurstShootsByBudPosition,
    input.observedClustersOnThoseShoots,
    "positions",
  );
  aligned(
    input.observedBurstShootsByBudPosition,
    input.observedRetainedBudCounts,
    "positions",
  );
  input.observedRetainedBudCounts.forEach((v) =>
    bounded(v, "buds", 1, 1000000),
  );
  input.observedBurstShootsByBudPosition.forEach((v, i) =>
    bounded(v, "burstShoots", 1, input.observedRetainedBudCounts[i]),
  );
  input.observedClustersOnThoseShoots.forEach((v) =>
    bounded(v, "clusters", 0, 1000000),
  );
  return {
    clustersPerObservedBurstShootByPosition:
      input.observedClustersOnThoseShoots.map(
        (v, i) => v / input.observedBurstShootsByBudPosition[i],
      ),
    pooledClustersPerObservedBurstShoot:
      sum(input.observedClustersOnThoseShoots) /
      sum(input.observedBurstShootsByBudPosition),
    observedBudBurstFractionsByPosition:
      input.observedBurstShootsByBudPosition.map(
        (v, i) => v / input.observedRetainedBudCounts[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBurstShootsByBudPosition: [2, 4],
  observedClustersOnThoseShoots: [1, 6],
  observedRetainedBudCounts: [3, 5],
} satisfies Input;
export const exampleOutput = {
  clustersPerObservedBurstShootByPosition: [0.5, 1.5],
  pooledClustersPerObservedBurstShoot: 1.1666666666666667,
  observedBudBurstFractionsByPosition: [0.6666666666666666, 0.8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/bud-fruitfulness-cluster-per-shoot-lookup",
  title: "Bud Fruitfulness Cluster Per Shoot Lookup",
  description:
    "Audit actual bud-position burst/cluster evidence with separate burst and conditional fruitfulness denominators; not crop-yield expansion, inferred productive buds or universal cultivar fruitfulness.",
  inputs: inputFields,
  outputs: [
    {
      id: "clustersPerObservedBurstShootByPosition",
      label: "Clusters per observed burst shoot by position",
      kind: "numberList",
    },
    {
      id: "pooledClustersPerObservedBurstShoot",
      label: "Pooled clusters per observed burst shoot",
      kind: "number",
    },
    {
      id: "observedBudBurstFractionsByPosition",
      label: "Observed bud burst fractions by position",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBurstShootsByBudPosition:
        value.observedBurstShootsByBudPosition as readonly number[],
      observedClustersOnThoseShoots:
        value.observedClustersOnThoseShoots as readonly number[],
      observedRetainedBudCounts:
        value.observedRetainedBudCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
