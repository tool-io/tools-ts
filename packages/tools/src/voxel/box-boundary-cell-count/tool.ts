import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ dimensions: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "dimensions", label: "dimensions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
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
  discovery: {
    aliases: ["Voxel Box Boundary Cell Count", "voxels", "3D geometry"],
    collections: ["data", "learn"],
    fields: ["voxel", "voxels", "3D geometry"],
    keywords: ["voxels", "3D geometry"],
  },
  id: "voxel/box-boundary-cell-count",
  title: "Voxel Box Boundary Cell Count",
  description:
    "Count distinct boundary voxel cells of a positive-size integer cuboid as total minus strictly interior; edges/corners count once.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { boundaryCells: { type: "string" } },
        required: ["boundaryCells"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
