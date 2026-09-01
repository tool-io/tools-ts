import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  aligned,
  sum,
  mean,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedDroppedClusterCounts: readonly number[];
  readonly measuredDroppedLotGrossMassKg: readonly number[];
  readonly measuredDroppedLotContainerTareKg: readonly number[];
  readonly representedDroppedClusterCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedDroppedMeanClusterMassKg: readonly number[];
  readonly expandedDroppedClusterMassKg: readonly number[];
  readonly totalExpandedDroppedMassKg: number;
}>;
const inputFields = [
  {
    id: "observedDroppedClusterCounts",
    label: "Observed dropped cluster counts",
    kind: "numberList",
  },
  {
    id: "measuredDroppedLotGrossMassKg",
    label: "Measured dropped lot gross mass kg",
    kind: "numberList",
  },
  {
    id: "measuredDroppedLotContainerTareKg",
    label: "Measured dropped lot container tare kg",
    kind: "numberList",
  },
  {
    id: "representedDroppedClusterCounts",
    label: "Represented dropped cluster counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredDroppedLotGrossMassKg.forEach((v) =>
    nonnegative(v, "measuredDroppedLotGrossMassKg"),
  );
  input.measuredDroppedLotContainerTareKg.forEach((v) =>
    nonnegative(v, "measuredDroppedLotContainerTareKg"),
  );
  aligned(
    input.observedDroppedClusterCounts,
    input.measuredDroppedLotGrossMassKg,
    "observedDroppedClusterCounts",
  );
  aligned(
    input.observedDroppedClusterCounts,
    input.measuredDroppedLotContainerTareKg,
    "observedDroppedClusterCounts",
  );
  aligned(
    input.observedDroppedClusterCounts,
    input.representedDroppedClusterCounts,
    "observedDroppedClusterCounts",
  );
  input.observedDroppedClusterCounts.forEach((v) =>
    bounded(v, "sampleClusters", 1, 1000000),
  );
  input.representedDroppedClusterCounts.forEach((v) =>
    bounded(v, "represented", 0, 1000000),
  );
  const masses = input.measuredDroppedLotGrossMassKg.map(
    (v, i) => v - input.measuredDroppedLotContainerTareKg[i],
  );
  if (masses.some((v) => v < 0))
    simpleError("tare", "Tare exceeds observed gross dropped lot mass.");
  const mean = masses.map((v, i) => v / input.observedDroppedClusterCounts[i]),
    expanded = mean.map((v, i) => v * input.representedDroppedClusterCounts[i]);
  return {
    observedDroppedMeanClusterMassKg: mean,
    expandedDroppedClusterMassKg: expanded,
    totalExpandedDroppedMassKg: sum(expanded),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDroppedClusterCounts: [2, 3],
  measuredDroppedLotGrossMassKg: [1, 2],
  measuredDroppedLotContainerTareKg: [0.2, 0.5],
  representedDroppedClusterCounts: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedDroppedMeanClusterMassKg: [0.4, 0.5],
  expandedDroppedClusterMassKg: [4, 10],
  totalExpandedDroppedMassKg: 14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/green-harvest-drop-cluster-weight",
  title: "Green Harvest Drop Cluster Weight Calculator",
  description:
    "Expand actual tare-corrected sampled dropped-cluster mass through independently observed dropped inventory; not target-yield thinning inverse, retained harvest forecast or removal recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDroppedMeanClusterMassKg",
      label: "Observed dropped mean cluster mass kg",
      kind: "numberList",
    },
    {
      id: "expandedDroppedClusterMassKg",
      label: "Expanded dropped cluster mass kg",
      kind: "numberList",
    },
    {
      id: "totalExpandedDroppedMassKg",
      label: "Total expanded dropped mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDroppedClusterCounts:
        value.observedDroppedClusterCounts as readonly number[],
      measuredDroppedLotGrossMassKg:
        value.measuredDroppedLotGrossMassKg as readonly number[],
      measuredDroppedLotContainerTareKg:
        value.measuredDroppedLotContainerTareKg as readonly number[],
      representedDroppedClusterCounts:
        value.representedDroppedClusterCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
