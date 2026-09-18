import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  dimensions: readonly number[];
  order: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dimensions", label: "dimensions", kind: "numberList" },
  { id: "order", label: "order", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.dimensions(i.dimensions);
  H.permutation(i.order);
  H.check(i.order.length === 3);
  let stride = 1n;
  const strides = [0n, 0n, 0n];
  for (const axis of i.order) {
    strides[axis] = stride;
    stride *= BigInt(i.dimensions[axis]);
  }
  return H.finish({ strides: strides.map(String), cells: String(stride) });
};
export const example = {
  input: { dimensions: [3, 4, 2], order: [2, 0, 1] },
  output: { result: { strides: ["2", "6", "1"], cells: "24" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/axis-order-stride-record",
  title: "Voxel Axis Order Stride Record",
  description:
    "Compute exact per-axis voxel strides for an explicit fastest-to-slowest axis permutation; distinguish physical axis order from a fixed row-major convention.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
