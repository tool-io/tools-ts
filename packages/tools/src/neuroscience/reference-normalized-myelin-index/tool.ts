import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned, mean } from "../shared.js";
export type Input = Readonly<{
  readonly roiT1Weighted: readonly number[];
  readonly roiT2Weighted: readonly number[];
  readonly referenceT1Weighted: readonly number[];
  readonly referenceT2Weighted: readonly number[];
}>;
export type Output = Readonly<{
  readonly roiRatios: readonly number[];
  readonly referenceMeanRatio: number;
  readonly normalizedIndex: number;
}>;
const inputFields = [
  { id: "roiT1Weighted", label: "Roi t1 weighted", kind: "numberList" },
  { id: "roiT2Weighted", label: "Roi t2 weighted", kind: "numberList" },
  {
    id: "referenceT1Weighted",
    label: "Reference t1 weighted",
    kind: "numberList",
  },
  {
    id: "referenceT2Weighted",
    label: "Reference t2 weighted",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.roiT1Weighted, input.roiT2Weighted, "roiT1Weighted");
  aligned(
    input.referenceT1Weighted,
    input.referenceT2Weighted,
    "referenceT1Weighted",
  );
  [
    input.roiT1Weighted,
    input.roiT2Weighted,
    input.referenceT1Weighted,
    input.referenceT2Weighted,
  ].forEach((row) => row.forEach((v) => positive(v, "signals")));
  const roiRatios = input.roiT1Weighted.map(
      (v, i) => v / input.roiT2Weighted[i],
    ),
    referenceMeanRatio = mean(
      input.referenceT1Weighted.map((v, i) => v / input.referenceT2Weighted[i]),
    );
  return {
    roiRatios,
    referenceMeanRatio,
    normalizedIndex: mean(roiRatios) / referenceMeanRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  roiT1Weighted: [20, 40],
  roiT2Weighted: [10, 10],
  referenceT1Weighted: [10, 10],
  referenceT2Weighted: [10, 10],
} satisfies Input;
export const exampleOutput = {
  roiRatios: [2, 4],
  referenceMeanRatio: 1,
  normalizedIndex: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/reference-normalized-myelin-index",
  title: "Myelination Index",
  description:
    "Compute reference-normalized T1w/T2w ROI ratios as an explicit myelin-sensitive imaging index; intensity bias correction is external and this is not a myelin fraction.",
  inputs: inputFields,
  outputs: [
    { id: "roiRatios", label: "Roi ratios", kind: "numberList" },
    { id: "referenceMeanRatio", label: "Reference mean ratio", kind: "number" },
    { id: "normalizedIndex", label: "Normalized index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      roiT1Weighted: value.roiT1Weighted as readonly number[],
      roiT2Weighted: value.roiT2Weighted as readonly number[],
      referenceT1Weighted: value.referenceT1Weighted as readonly number[],
      referenceT2Weighted: value.referenceT2Weighted as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
