import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ index: string; dimensions: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "index", label: "index", kind: "string" },
  { id: "dimensions", label: "dimensions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.dimensions(i.dimensions);
  const index = H.bigint(i.index),
    x = BigInt(i.dimensions[0]),
    y = BigInt(i.dimensions[1]);
  H.check(index >= 0n && index < H.voxelVolume(i.dimensions));
  return H.finish({
    coordinate: [
      Number(index % x),
      Number((index / x) % y),
      Number(index / (x * y)),
    ],
  });
};
export const example = {
  input: { index: "19", dimensions: [3, 4, 2] },
  output: { result: { coordinate: [1, 2, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Voxel Row Major Index to XYZ", "voxels", "3D geometry"],
    collections: ["data", "learn"],
    fields: ["voxel", "voxels", "3D geometry"],
    keywords: ["voxels", "3D geometry"],
  },
  id: "voxel/row-major-index-xyz",
  title: "Voxel Row Major Index to XYZ",
  description:
    "Invert an exact zero-based voxel x-fastest row-major index with explicit positive dimensions, rejecting out-of-volume values rather than wrapping.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinate: { type: "array", items: { type: "number" } },
        },
        required: ["coordinate"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
