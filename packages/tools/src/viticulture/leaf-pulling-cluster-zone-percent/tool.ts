import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedInitialClusterZoneLeafAreasM2: readonly number[];
  readonly observedRetainedClusterZoneLeafAreasM2: readonly number[];
  readonly observedOutsideClusterZoneLeafAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly clusterZoneRemovedLeafAreasM2: readonly number[];
  readonly pooledClusterZoneLeafAreaRemovalFraction: number;
  readonly wholeCanopyLeafAreaRemovalFraction: number;
}>;
const inputFields = [
  {
    id: "observedInitialClusterZoneLeafAreasM2",
    label: "Observed initial cluster zone leaf areas m2",
    kind: "numberList",
  },
  {
    id: "observedRetainedClusterZoneLeafAreasM2",
    label: "Observed retained cluster zone leaf areas m2",
    kind: "numberList",
  },
  {
    id: "observedOutsideClusterZoneLeafAreasM2",
    label: "Observed outside cluster zone leaf areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedInitialClusterZoneLeafAreasM2.forEach((v) =>
    nonnegative(v, "observedInitialClusterZoneLeafAreasM2"),
  );
  input.observedRetainedClusterZoneLeafAreasM2.forEach((v) =>
    nonnegative(v, "observedRetainedClusterZoneLeafAreasM2"),
  );
  input.observedOutsideClusterZoneLeafAreasM2.forEach((v) =>
    nonnegative(v, "observedOutsideClusterZoneLeafAreasM2"),
  );
  aligned(
    input.observedInitialClusterZoneLeafAreasM2,
    input.observedRetainedClusterZoneLeafAreasM2,
    "observedInitialClusterZoneLeafAreasM2",
  );
  aligned(
    input.observedInitialClusterZoneLeafAreasM2,
    input.observedOutsideClusterZoneLeafAreasM2,
    "observedInitialClusterZoneLeafAreasM2",
  );
  const removed = input.observedInitialClusterZoneLeafAreasM2.map(
    (v, i) => v - input.observedRetainedClusterZoneLeafAreasM2[i],
  );
  if (removed.some((v) => v < 0))
    simpleError(
      "leaves",
      "Matched retained zone leaf area exceeds initial inventory.",
    );
  const initial = sum(input.observedInitialClusterZoneLeafAreasM2);
  positive(initial, "initialZoneArea");
  const area = sum(removed);
  return {
    clusterZoneRemovedLeafAreasM2: removed,
    pooledClusterZoneLeafAreaRemovalFraction: area / initial,
    wholeCanopyLeafAreaRemovalFraction:
      area / (initial + sum(input.observedOutsideClusterZoneLeafAreasM2)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInitialClusterZoneLeafAreasM2: [2, 4],
  observedRetainedClusterZoneLeafAreasM2: [1, 3],
  observedOutsideClusterZoneLeafAreasM2: [3, 5],
} satisfies Input;
export const exampleOutput = {
  clusterZoneRemovedLeafAreasM2: [1, 1],
  pooledClusterZoneLeafAreaRemovalFraction: 0.3333333333333333,
  wholeCanopyLeafAreaRemovalFraction: 0.14285714285714285,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/leaf-pulling-cluster-zone-percent",
  title: "Leaf Pulling Cluster Zone Percent Calculator",
  description:
    "Reconcile actual cluster-zone leaf-area removal and independent outside-zone area, keeping zone versus whole-canopy denominator distinct; no shoot-removal alias, sunburn/microclimate response or recommended leaf pulling.",
  inputs: inputFields,
  outputs: [
    {
      id: "clusterZoneRemovedLeafAreasM2",
      label: "Cluster zone removed leaf areas m2",
      kind: "numberList",
    },
    {
      id: "pooledClusterZoneLeafAreaRemovalFraction",
      label: "Pooled cluster zone leaf area removal fraction",
      kind: "number",
    },
    {
      id: "wholeCanopyLeafAreaRemovalFraction",
      label: "Whole canopy leaf area removal fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInitialClusterZoneLeafAreasM2:
        value.observedInitialClusterZoneLeafAreasM2 as readonly number[],
      observedRetainedClusterZoneLeafAreasM2:
        value.observedRetainedClusterZoneLeafAreasM2 as readonly number[],
      observedOutsideClusterZoneLeafAreasM2:
        value.observedOutsideClusterZoneLeafAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
