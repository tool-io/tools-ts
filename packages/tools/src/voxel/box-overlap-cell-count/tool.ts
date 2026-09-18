import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  leftLow: readonly number[];
  leftHigh: readonly number[];
  rightLow: readonly number[];
  rightHigh: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftLow", label: "leftLow", kind: "numberList" },
  { id: "leftHigh", label: "leftHigh", kind: "numberList" },
  { id: "rightLow", label: "rightLow", kind: "numberList" },
  { id: "rightHigh", label: "rightHigh", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.voxelBox(i.leftLow, i.leftHigh);
  H.voxelBox(i.rightLow, i.rightHigh);
  const widths = i.leftLow.map((x, j) =>
    Math.max(
      0,
      Math.min(i.leftHigh[j], i.rightHigh[j]) - Math.max(x, i.rightLow[j]),
    ),
  );
  return H.finish({ dimensions: widths, count: String(H.voxelVolume(widths)) });
};
export const example = {
  input: {
    leftLow: [0, 0, 0],
    leftHigh: [3, 3, 3],
    rightLow: [2, 1, 0],
    rightHigh: [4, 2, 2],
  },
  output: { result: { dimensions: [1, 1, 2], count: "2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/box-overlap-cell-count",
  title: "Voxel Box Overlap Cell Count",
  description:
    "Count integer voxel cells in the intersection of two half-open integer boxes; touching faces have zero cells and no physical-volume inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
