import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly sliceCentersMm: readonly number[];
  readonly sliceThicknessesMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly edgeGapsMm: readonly number[];
  readonly overlapPairIndexes: readonly number[];
}>;
const inputFields = [
  {
    id: "sliceCentersMm",
    label: "Slice centers mm",
    kind: "numberList",
    unit: "mm",
  },
  {
    id: "sliceThicknessesMm",
    label: "Slice thicknesses mm",
    kind: "numberList",
    unit: "mm",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.sliceCentersMm, input.sliceThicknessesMm, "sliceCentersMm");
  ordered(input.sliceCentersMm, "sliceCentersMm");
  input.sliceThicknessesMm.forEach((v) => positive(v, "sliceThicknessesMm"));
  const edgeGapsMm = input.sliceCentersMm
    .slice(1)
    .map(
      (v, i) =>
        v -
        input.sliceCentersMm[i] -
        (input.sliceThicknessesMm[i] + input.sliceThicknessesMm[i + 1]) / 2,
    );
  return {
    edgeGapsMm,
    overlapPairIndexes: edgeGapsMm.flatMap((v, i) => (v < 0 ? [i] : [])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sliceCentersMm: [0, 6, 12],
  sliceThicknessesMm: [5, 5, 7],
} satisfies Input;
export const exampleOutput = {
  edgeGapsMm: [1, 0],
  overlapPairIndexes: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/slice-gap-overlap-audit",
  title: "Slice Gap",
  description:
    "Audit adjacent slice edge gaps and overlaps along a common slice-normal axis; centers and physical slice thicknesses share millimetre units.",
  inputs: inputFields,
  outputs: [
    { id: "edgeGapsMm", label: "Edge gaps mm", kind: "numberList", unit: "mm" },
    {
      id: "overlapPairIndexes",
      label: "Overlap pair indexes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sliceCentersMm: value.sliceCentersMm as readonly number[],
      sliceThicknessesMm: value.sliceThicknessesMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
