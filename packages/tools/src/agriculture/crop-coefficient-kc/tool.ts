import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedCropEtMm: readonly number[];
  readonly matchedReferenceEtMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalCropCoefficientKc: readonly number[];
  readonly referenceExposureWeightedKc: number;
}>;
const inputFields = [
  { id: "observedCropEtMm", label: "Observed crop et mm", kind: "numberList" },
  {
    id: "matchedReferenceEtMm",
    label: "Matched reference et mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedReferenceEtMm.forEach((v) =>
    positive(v, "matchedReferenceEtMm"),
  );
  input.observedCropEtMm.forEach((v) => nonnegative(v, "observedCropEtMm"));
  aligned(
    input.observedCropEtMm,
    input.matchedReferenceEtMm,
    "observedCropEtMm",
  );
  return {
    intervalCropCoefficientKc: input.observedCropEtMm.map(
      (v, i) => v / input.matchedReferenceEtMm[i],
    ),
    referenceExposureWeightedKc:
      sum(input.observedCropEtMm) / sum(input.matchedReferenceEtMm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCropEtMm: [2, 6],
  matchedReferenceEtMm: [1, 2],
} satisfies Input;
export const exampleOutput = {
  intervalCropCoefficientKc: [2, 3],
  referenceExposureWeightedKc: 2.6666666666666665,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/crop-coefficient-kc",
  title: "Agriculture Crop Coefficient Kc Calculator",
  description:
    "Infer matched measured ET crop/ET reference intervals, pooled reference exposure not meanKc or species table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalCropCoefficientKc",
      label: "Interval crop coefficient kc",
      kind: "numberList",
    },
    {
      id: "referenceExposureWeightedKc",
      label: "Reference exposure weighted kc",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCropEtMm: value.observedCropEtMm as readonly number[],
      matchedReferenceEtMm: value.matchedReferenceEtMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
