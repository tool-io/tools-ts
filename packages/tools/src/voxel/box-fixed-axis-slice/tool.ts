import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  low: readonly number[];
  high: readonly number[];
  axis: number;
  coordinate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "low", label: "low", kind: "numberList" },
  { id: "high", label: "high", kind: "numberList" },
  { id: "axis", label: "axis", kind: "integer" },
  { id: "coordinate", label: "coordinate", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.voxelBox(i.low, i.high);
  H.int(i.axis, 0, 2);
  H.int(i.coordinate, -1e9, 1e9);
  return H.finish({
    empty: i.coordinate < i.low[i.axis] || i.coordinate >= i.high[i.axis],
    axes: [0, 1, 2].filter((j) => j !== i.axis),
    low: i.low.filter((_, j) => j !== i.axis),
    high: i.high.filter((_, j) => j !== i.axis),
  });
};
export const example = {
  input: { low: [0, 0, 0], high: [2, 3, 4], axis: 1, coordinate: 3 },
  output: { result: { empty: true, axes: [0, 2], low: [0, 0], high: [2, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/box-fixed-axis-slice",
  title: "Voxel Box Fixed Axis Slice",
  description:
    "Report the two-dimensional half-open cross-section bounds and explicit emptiness of one integer fixed-axis voxel-box slice; no cell enumeration or interpolation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
