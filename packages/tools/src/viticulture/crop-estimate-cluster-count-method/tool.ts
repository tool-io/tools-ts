import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  mean,
  variance,
} from "../shared.js";
export type Input = Readonly<{
  readonly randomSampleClusterCountsPerVine: readonly number[];
  readonly representedBlockVineCount: number;
  readonly callerMeanMatureClusterMassKg: number;
}>;
export type Output = Readonly<{
  readonly sampleMeanClustersPerVine: number;
  readonly clusterMeanStandardErrorPerVine: number;
  readonly modeledBlockYieldTonnes: number;
  readonly clusterSamplingOnlyYieldStandardErrorTonnes: number;
}>;
const inputFields = [
  {
    id: "randomSampleClusterCountsPerVine",
    label: "Random sample cluster counts per vine",
    kind: "numberList",
  },
  {
    id: "representedBlockVineCount",
    label: "Represented block vine count",
    kind: "integer",
  },
  {
    id: "callerMeanMatureClusterMassKg",
    label: "Caller mean mature cluster mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMeanMatureClusterMassKg,
    "callerMeanMatureClusterMassKg",
  );
  input.randomSampleClusterCountsPerVine.forEach((v) =>
    count(v, "randomSampleClusterCountsPerVine"),
  );
  count(input.representedBlockVineCount, "representedBlockVineCount");
  const n = input.randomSampleClusterCountsPerVine.length,
    m = mean(input.randomSampleClusterCountsPerVine),
    se = Math.sqrt(variance(input.randomSampleClusterCountsPerVine) / n),
    factor =
      (input.representedBlockVineCount * input.callerMeanMatureClusterMassKg) /
      1000;
  return {
    sampleMeanClustersPerVine: m,
    clusterMeanStandardErrorPerVine: se,
    modeledBlockYieldTonnes: m * factor,
    clusterSamplingOnlyYieldStandardErrorTonnes: se * factor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  randomSampleClusterCountsPerVine: [10, 20, 30],
  representedBlockVineCount: 100,
  callerMeanMatureClusterMassKg: 0.2,
} satisfies Input;
export const exampleOutput = {
  sampleMeanClustersPerVine: 20,
  clusterMeanStandardErrorPerVine: 5.773502691896258,
  modeledBlockYieldTonnes: 0.4,
  clusterSamplingOnlyYieldStandardErrorTonnes: 0.11547005383792516,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/crop-estimate-cluster-count-method",
  title: "Crop Estimate Cluster Count Method",
  description:
    "Expand equal-probability sampled vine cluster counts to block yield with caller mature-cluster mass and count-sampling error only; no weight/selection uncertainty, harvest guarantee or optimum crop load.",
  inputs: inputFields,
  outputs: [
    {
      id: "sampleMeanClustersPerVine",
      label: "Sample mean clusters per vine",
      kind: "number",
    },
    {
      id: "clusterMeanStandardErrorPerVine",
      label: "Cluster mean standard error per vine",
      kind: "number",
    },
    {
      id: "modeledBlockYieldTonnes",
      label: "Modeled block yield tonnes",
      kind: "number",
    },
    {
      id: "clusterSamplingOnlyYieldStandardErrorTonnes",
      label: "Cluster sampling only yield standard error tonnes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      randomSampleClusterCountsPerVine:
        value.randomSampleClusterCountsPerVine as readonly number[],
      representedBlockVineCount: value.representedBlockVineCount as number,
      callerMeanMatureClusterMassKg:
        value.callerMeanMatureClusterMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
