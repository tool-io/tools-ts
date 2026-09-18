import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coordinate: readonly number[];
  dimensions: readonly number[];
  order: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coordinate", label: "coordinate", kind: "numberList" },
  { id: "dimensions", label: "dimensions", kind: "numberList" },
  { id: "order", label: "order", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.dimensions(i.dimensions);
  H.voxel(i.coordinate);
  H.permutation(i.order);
  H.check(i.order.length === 3);
  i.coordinate.forEach((x, j) => H.int(x, 0, i.dimensions[j] - 1));
  return H.finish({
    coordinate: i.order.map((j) => i.coordinate[j]),
    dimensions: i.order.map((j) => i.dimensions[j]),
  });
};
export const example = {
  input: { coordinate: [1, 2, 1], dimensions: [3, 4, 2], order: [2, 0, 1] },
  output: { result: { coordinate: [1, 1, 2], dimensions: [2, 3, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/coordinate-axis-permutation",
  title: "Voxel Coordinate Axis Permutation",
  description:
    "Permute a bounded voxel coordinate together with volume dimensions using an explicit output-to-input axis permutation; no interpolation or spatial resampling.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
