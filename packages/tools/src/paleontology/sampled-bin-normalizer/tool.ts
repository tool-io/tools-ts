import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampledOccurrenceCounts: readonly number[];
  readonly sampledRockVolumesM3: readonly number[];
  readonly recoveryProbabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly detectionAdjustedOccurrencesPerM3: readonly number[];
  readonly pooledAdjustedOccurrencesPerM3: number;
}>;
const inputFields = [
  {
    id: "sampledOccurrenceCounts",
    label: "Sampled occurrence counts",
    kind: "numberList",
  },
  {
    id: "sampledRockVolumesM3",
    label: "Sampled rock volumes m3",
    kind: "numberList",
  },
  {
    id: "recoveryProbabilities",
    label: "Recovery probabilities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampledRockVolumesM3.forEach((v) =>
    positive(v, "sampledRockVolumesM3"),
  );
  input.recoveryProbabilities.forEach((v) =>
    positive(v, "recoveryProbabilities"),
  );
  input.recoveryProbabilities.forEach((v) =>
    fraction(v, "recoveryProbabilities"),
  );
  input.sampledOccurrenceCounts.forEach((v) =>
    count(v, "sampledOccurrenceCounts"),
  );
  aligned(
    input.sampledOccurrenceCounts,
    input.sampledRockVolumesM3,
    "sampledOccurrenceCounts",
  );
  aligned(
    input.sampledOccurrenceCounts,
    input.recoveryProbabilities,
    "sampledOccurrenceCounts",
  );
  return {
    detectionAdjustedOccurrencesPerM3: input.sampledOccurrenceCounts.map(
      (v, i) =>
        v / input.recoveryProbabilities[i] / input.sampledRockVolumesM3[i],
    ),
    pooledAdjustedOccurrencesPerM3:
      input.sampledOccurrenceCounts.reduce(
        (s, v, i) => s + v / input.recoveryProbabilities[i],
        0,
      ) / input.sampledRockVolumesM3.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampledOccurrenceCounts: [10, 20, 0],
  sampledRockVolumesM3: [1, 4, 2],
  recoveryProbabilities: [0.5, 1, 0.25],
} satisfies Input;
export const exampleOutput = {
  detectionAdjustedOccurrencesPerM3: [20, 5, 0],
  pooledAdjustedOccurrencesPerM3: 5.714285714285714,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/sampled-bin-normalizer",
  title: "Sampled-in-Bin Occurance Normalizer",
  description:
    "Normalize sampled-in-bin occurrence counts by measured rock exposure and caller recovery probability, not by unequal bin duration alone; no unsampled-bin imputation.",
  inputs: inputFields,
  outputs: [
    {
      id: "detectionAdjustedOccurrencesPerM3",
      label: "Detection adjusted occurrences per m3",
      kind: "numberList",
    },
    {
      id: "pooledAdjustedOccurrencesPerM3",
      label: "Pooled adjusted occurrences per m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampledOccurrenceCounts:
        value.sampledOccurrenceCounts as readonly number[],
      sampledRockVolumesM3: value.sampledRockVolumesM3 as readonly number[],
      recoveryProbabilities: value.recoveryProbabilities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
