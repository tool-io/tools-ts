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
  readonly berrySampleMassesGrams: readonly number[];
  readonly sampleBerryCounts: readonly number[];
  readonly sampleContainerTaresGrams: readonly number[];
}>;
export type Output = Readonly<{
  readonly netBerrySampleMassesGrams: readonly number[];
  readonly pooledObservedBerryMassGrams: number;
  readonly perSampleBerryMassGrams: readonly number[];
}>;
const inputFields = [
  {
    id: "berrySampleMassesGrams",
    label: "Berry sample masses grams",
    kind: "numberList",
  },
  { id: "sampleBerryCounts", label: "Sample berry counts", kind: "numberList" },
  {
    id: "sampleContainerTaresGrams",
    label: "Sample container tares grams",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleBerryCounts.forEach((v) => positive(v, "sampleBerryCounts"));
  input.berrySampleMassesGrams.forEach((v) =>
    nonnegative(v, "berrySampleMassesGrams"),
  );
  input.sampleContainerTaresGrams.forEach((v) =>
    nonnegative(v, "sampleContainerTaresGrams"),
  );
  input.sampleBerryCounts.forEach((v) => count(v, "sampleBerryCounts"));
  aligned(
    input.berrySampleMassesGrams,
    input.sampleBerryCounts,
    "berrySampleMassesGrams",
  );
  aligned(
    input.berrySampleMassesGrams,
    input.sampleContainerTaresGrams,
    "berrySampleMassesGrams",
  );
  const netBerrySampleMassesGrams = input.berrySampleMassesGrams.map((v, i) =>
    nonnegative(v - input.sampleContainerTaresGrams[i], "sampleTare"),
  );
  return {
    netBerrySampleMassesGrams,
    pooledObservedBerryMassGrams:
      netBerrySampleMassesGrams.reduce((a, b) => a + b, 0) /
      input.sampleBerryCounts.reduce((a, b) => a + b, 0),
    perSampleBerryMassGrams: netBerrySampleMassesGrams.map(
      (v, i) => v / input.sampleBerryCounts[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  berrySampleMassesGrams: [10, 30],
  sampleBerryCounts: [10, 20],
  sampleContainerTaresGrams: [0, 0],
} satisfies Input;
export const exampleOutput = {
  netBerrySampleMassesGrams: [10, 30],
  pooledObservedBerryMassGrams: 1.3333333333333333,
  perSampleBerryMassGrams: [1, 1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/berry-average-weight-from-sample",
  title: "Berry Average Weight From Sample",
  description:
    "Pool counted berry subsamples with independent container tare and unequal berry denominators; not a variety average or equal-sample mean.",
  inputs: inputFields,
  outputs: [
    {
      id: "netBerrySampleMassesGrams",
      label: "Net berry sample masses grams",
      kind: "numberList",
    },
    {
      id: "pooledObservedBerryMassGrams",
      label: "Pooled observed berry mass grams",
      kind: "number",
    },
    {
      id: "perSampleBerryMassGrams",
      label: "Per sample berry mass grams",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      berrySampleMassesGrams: value.berrySampleMassesGrams as readonly number[],
      sampleBerryCounts: value.sampleBerryCounts as readonly number[],
      sampleContainerTaresGrams:
        value.sampleContainerTaresGrams as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
