import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ dimensions: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dimensions", label: "dimensions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.dimensions(i.dimensions);
  return H.finish({
    boundaryCells: String(
      H.voxelVolume(i.dimensions) -
        H.voxelVolume(i.dimensions.map((x) => Math.max(0, x - 2))),
    ),
  });
};
export const example = {
  input: { dimensions: [3, 3, 3] },
  output: { result: { boundaryCells: "26" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/box-boundary-cell-count",
  title: "Voxel Box Boundary Cell Count",
  description:
    "Count distinct boundary voxel cells of a positive-size integer cuboid as total minus strictly interior; edges/corners count once.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
