import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coordinate: readonly number[];
  dimensions: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coordinate", label: "coordinate", kind: "numberList" },
  { id: "dimensions", label: "dimensions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.dimensions(i.dimensions);
  H.voxel(i.coordinate);
  i.coordinate.forEach((x, j) => H.int(x, 0, i.dimensions[j] - 1));
  return H.finish({
    index: String(
      (BigInt(i.coordinate[2]) * BigInt(i.dimensions[1]) +
        BigInt(i.coordinate[1])) *
        BigInt(i.dimensions[0]) +
        BigInt(i.coordinate[0]),
    ),
  });
};
export const example = {
  input: { coordinate: [1, 2, 1], dimensions: [3, 4, 2] },
  output: { result: { index: "19" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Voxel XYZ Row Major Index", "voxels", "3D geometry"],
    collections: ["data", "learn"],
    fields: ["voxel", "voxels", "3D geometry"],
    keywords: ["voxels", "3D geometry"],
  },
  id: "voxel/xyz-row-major-index",
  title: "Voxel XYZ Row Major Index",
  description:
    "Encode bounded voxel x,y,z to an exact row-major linear index with x fastest, then y, then z; dimensions are explicit positive cell counts.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { index: { type: "string" } },
        required: ["index"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
