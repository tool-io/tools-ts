import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly segmentGrossVolumesM3: readonly number[];
  readonly mutuallyExclusiveDefectFractionsBySegment: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly segmentNetVolumesM3: readonly number[];
  readonly totalDefectDeductionM3: number;
  readonly totalNetScaleVolumeM3: number;
}>;
const inputFields = [
  {
    id: "segmentGrossVolumesM3",
    label: "Segment gross volumes m3",
    kind: "numberList",
  },
  {
    id: "mutuallyExclusiveDefectFractionsBySegment",
    label: "Mutually exclusive defect fractions by segment",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.segmentGrossVolumesM3.forEach((v) =>
    nonnegative(v, "segmentGrossVolumesM3"),
  );
  shape(
    input.mutuallyExclusiveDefectFractionsBySegment,
    "mutuallyExclusiveDefectFractionsBySegment",
  );
  aligned(
    input.segmentGrossVolumesM3,
    input.mutuallyExclusiveDefectFractionsBySegment,
    "segments",
  );
  const segmentNetVolumesM3 = input.segmentGrossVolumesM3.map((v, i) => {
      const row = input.mutuallyExclusiveDefectFractionsBySegment[i];
      row.forEach((x) => fraction(x, "defects"));
      return (
        v *
        (1 -
          fraction(
            row.reduce((a, b) => a + b, 0),
            "exclusiveDefectSum",
          ))
      );
    }),
    totalNetScaleVolumeM3 = segmentNetVolumesM3.reduce((a, b) => a + b, 0);
  return {
    segmentNetVolumesM3,
    totalDefectDeductionM3:
      input.segmentGrossVolumesM3.reduce((a, b) => a + b, 0) -
      totalNetScaleVolumeM3,
    totalNetScaleVolumeM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  segmentGrossVolumesM3: [10, 20],
  mutuallyExclusiveDefectFractionsBySegment: [
    [0.1, 0.2],
    [0.2, 0.1],
  ],
} satisfies Input;
export const exampleOutput = {
  segmentNetVolumesM3: [7, 14],
  totalDefectDeductionM3: 9,
  totalNetScaleVolumeM3: 21,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/defect-deduction-percent-gross-scale",
  title: "Defect Deduction Percent Gross Scale",
  description:
    "Deduct separately declared mutually exclusive volume defects by measured log segment and conserve gross/net inventory; overlapping causes must not be double counted and no regional commercial scaling rule is embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentNetVolumesM3",
      label: "Segment net volumes m3",
      kind: "numberList",
    },
    {
      id: "totalDefectDeductionM3",
      label: "Total defect deduction m3",
      kind: "number",
    },
    {
      id: "totalNetScaleVolumeM3",
      label: "Total net scale volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      segmentGrossVolumesM3: value.segmentGrossVolumesM3 as readonly number[],
      mutuallyExclusiveDefectFractionsBySegment:
        value.mutuallyExclusiveDefectFractionsBySegment as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
