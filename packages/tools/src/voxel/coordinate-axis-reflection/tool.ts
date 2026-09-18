import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coordinate: readonly number[];
  dimensions: readonly number[];
  reflect: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coordinate", label: "coordinate", kind: "numberList" },
  { id: "dimensions", label: "dimensions", kind: "numberList" },
  { id: "reflect", label: "reflect", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.dimensions(i.dimensions);
  H.voxel(i.coordinate);
  H.check(i.reflect.length === 3 && i.reflect.every((x) => x === 0 || x === 1));
  i.coordinate.forEach((x, j) => H.int(x, 0, i.dimensions[j] - 1));
  return H.finish({
    coordinate: i.coordinate.map((x, j) =>
      i.reflect[j] ? i.dimensions[j] - 1 - x : x,
    ),
  });
};
export const example = {
  input: { coordinate: [0, 1, 1], dimensions: [3, 4, 2], reflect: [1, 0, 1] },
  output: { result: { coordinate: [2, 1, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/coordinate-axis-reflection",
  title: "Voxel Coordinate Axis Reflection",
  description:
    "Reflect explicitly selected voxel cell axes within a bounded volume, preserving the other coordinates and dimensions; no world-coordinate transformation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
