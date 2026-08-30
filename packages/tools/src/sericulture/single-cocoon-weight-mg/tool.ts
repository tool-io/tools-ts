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
  readonly grossSampleMassesGrams: readonly number[];
  readonly containerTaresGrams: readonly number[];
  readonly cocoonCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly batchMeanCocoonMassMg: readonly number[];
  readonly pooledMeanCocoonMassMg: number;
}>;
const inputFields = [
  {
    id: "grossSampleMassesGrams",
    label: "Gross sample masses grams",
    kind: "numberList",
  },
  {
    id: "containerTaresGrams",
    label: "Container tares grams",
    kind: "numberList",
  },
  { id: "cocoonCounts", label: "Cocoon counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cocoonCounts.forEach((v) => positive(v, "cocoonCounts"));
  input.grossSampleMassesGrams.forEach((v) =>
    nonnegative(v, "grossSampleMassesGrams"),
  );
  input.containerTaresGrams.forEach((v) =>
    nonnegative(v, "containerTaresGrams"),
  );
  input.cocoonCounts.forEach((v) => count(v, "cocoonCounts"));
  aligned(
    input.grossSampleMassesGrams,
    input.containerTaresGrams,
    "grossSampleMassesGrams",
  );
  aligned(
    input.grossSampleMassesGrams,
    input.cocoonCounts,
    "grossSampleMassesGrams",
  );
  const masses = input.grossSampleMassesGrams.map((v, i) =>
    nonnegative(v - input.containerTaresGrams[i], "containerTaresGrams"),
  );
  return {
    batchMeanCocoonMassMg: masses.map(
      (v, i) => (v / input.cocoonCounts[i]) * 1000,
    ),
    pooledMeanCocoonMassMg:
      (masses.reduce((a, b) => a + b, 0) /
        input.cocoonCounts.reduce((a, b) => a + b, 0)) *
      1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  grossSampleMassesGrams: [11, 22],
  containerTaresGrams: [1, 2],
  cocoonCounts: [5, 10],
} satisfies Input;
export const exampleOutput = {
  batchMeanCocoonMassMg: [2000, 2000],
  pooledMeanCocoonMassMg: 2000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/single-cocoon-weight-mg",
  title: "Single Cocoon Weight MG",
  description:
    "Calculate tare-corrected batch and pooled single-cocoon mg means with count weighting; no nominal breed cocoon mass table.",
  inputs: inputFields,
  outputs: [
    {
      id: "batchMeanCocoonMassMg",
      label: "Batch mean cocoon mass mg",
      kind: "numberList",
    },
    {
      id: "pooledMeanCocoonMassMg",
      label: "Pooled mean cocoon mass mg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      grossSampleMassesGrams: value.grossSampleMassesGrams as readonly number[],
      containerTaresGrams: value.containerTaresGrams as readonly number[],
      cocoonCounts: value.cocoonCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
