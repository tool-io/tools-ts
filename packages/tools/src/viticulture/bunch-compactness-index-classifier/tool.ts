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
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly clusterBerryCounts: readonly number[];
  readonly meanBerryVolumesCm3: readonly number[];
  readonly measuredClusterEnvelopeVolumesCm3: readonly number[];
  readonly callerPackingLowerEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedBerryPackingFractions: readonly number[];
  readonly callerCompactnessClassCodes: readonly number[];
}>;
const inputFields = [
  {
    id: "clusterBerryCounts",
    label: "Cluster berry counts",
    kind: "numberList",
  },
  {
    id: "meanBerryVolumesCm3",
    label: "Mean berry volumes cm3",
    kind: "numberList",
  },
  {
    id: "measuredClusterEnvelopeVolumesCm3",
    label: "Measured cluster envelope volumes cm3",
    kind: "numberList",
  },
  {
    id: "callerPackingLowerEdges",
    label: "Caller packing lower edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredClusterEnvelopeVolumesCm3.forEach((v) =>
    positive(v, "measuredClusterEnvelopeVolumesCm3"),
  );
  input.meanBerryVolumesCm3.forEach((v) =>
    nonnegative(v, "meanBerryVolumesCm3"),
  );
  input.clusterBerryCounts.forEach((v) => count(v, "clusterBerryCounts"));
  aligned(
    input.clusterBerryCounts,
    input.meanBerryVolumesCm3,
    "clusterBerryCounts",
  );
  aligned(
    input.clusterBerryCounts,
    input.measuredClusterEnvelopeVolumesCm3,
    "clusterBerryCounts",
  );
  const observedBerryPackingFractions = input.clusterBerryCounts.map((v, i) =>
    fraction(
      (v * input.meanBerryVolumesCm3[i]) /
        input.measuredClusterEnvelopeVolumesCm3[i],
      "packing",
    ),
  );
  return {
    observedBerryPackingFractions,
    callerCompactnessClassCodes: observedBerryPackingFractions.map((v) =>
      bands(input.callerPackingLowerEdges, v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  clusterBerryCounts: [100, 200],
  meanBerryVolumesCm3: [1, 1],
  measuredClusterEnvelopeVolumesCm3: [200, 400],
  callerPackingLowerEdges: [0, 0.4, 0.7],
} satisfies Input;
export const exampleOutput = {
  observedBerryPackingFractions: [0.5, 0.5],
  callerCompactnessClassCodes: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/bunch-compactness-index-classifier",
  title: "Bunch Compactness Index Classifier",
  description:
    "Audit measured berry solid-volume/cluster-envelope packing proxy under caller compactness bands; no universal OIV score, overlap correction or rot susceptibility prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBerryPackingFractions",
      label: "Observed berry packing fractions",
      kind: "numberList",
    },
    {
      id: "callerCompactnessClassCodes",
      label: "Caller compactness class codes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      clusterBerryCounts: value.clusterBerryCounts as readonly number[],
      meanBerryVolumesCm3: value.meanBerryVolumesCm3 as readonly number[],
      measuredClusterEnvelopeVolumesCm3:
        value.measuredClusterEnvelopeVolumesCm3 as readonly number[],
      callerPackingLowerEdges:
        value.callerPackingLowerEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
