import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly sampleIds: readonly string[];
  readonly coliformCounts: readonly number[];
  readonly testedVolumesMl: readonly number[];
  readonly maximumAllowedCount: number;
}>;
export type Output = Readonly<{
  readonly nonconformingSamples: readonly string[];
  readonly totalTestedVolumeMl: number;
  readonly allObservedSamplesConform: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.sampleIds, input.coliformCounts, "sampleIds");
  aligned(input.sampleIds, input.testedVolumesMl, "sampleIds");
  count(input.maximumAllowedCount, "maximumAllowedCount");
  input.coliformCounts.forEach((v) => count(v, "coliformCounts"));
  input.testedVolumesMl.forEach((v) => positive(v, "testedVolumesMl"));
  if (new Set(input.sampleIds).size !== input.sampleIds.length)
    simpleError("sampleIds", "Distinct water sample IDs required.");
  const nonconformingSamples = input.sampleIds.filter(
    (_, i) => input.coliformCounts[i] > input.maximumAllowedCount,
  );
  return {
    nonconformingSamples,
    totalTestedVolumeMl: input.testedVolumesMl.reduce((a, b) => a + b, 0),
    allObservedSamplesConform: nonconformingSamples.length === 0,
  };
};
export const exampleInput = {
  sampleIds: ["A", "B"],
  coliformCounts: [0, 1],
  testedVolumesMl: [100, 100],
  maximumAllowedCount: 0,
} satisfies Input;
export const exampleOutput = {
  nonconformingSamples: ["B"],
  totalTestedVolumeMl: 200,
  allObservedSamplesConform: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/water-coliform-sample-compliance",
  title: "Water Coliform Sample Compliance",
  description:
    "Audit water-sample coliform observations against a supplied per-sample allowance, retaining tested volumes; nondetection is not guaranteed sterility.",
  inputs: [
    { id: "sampleIds", label: "Sample ids", kind: "stringList" },
    { id: "coliformCounts", label: "Coliform counts", kind: "numberList" },
    { id: "testedVolumesMl", label: "Tested volumes ml", kind: "numberList" },
    {
      id: "maximumAllowedCount",
      label: "Maximum allowed count",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "nonconformingSamples",
      label: "Nonconforming samples",
      kind: "stringList",
    },
    {
      id: "totalTestedVolumeMl",
      label: "Total tested volume ml",
      kind: "number",
    },
    {
      id: "allObservedSamplesConform",
      label: "All observed samples conform",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleIds: value.sampleIds as readonly string[],
      coliformCounts: value.coliformCounts as readonly number[],
      testedVolumesMl: value.testedVolumesMl as readonly number[],
      maximumAllowedCount: value.maximumAllowedCount as number,
    }),
});
export const run = tool.execute;
export default tool;
