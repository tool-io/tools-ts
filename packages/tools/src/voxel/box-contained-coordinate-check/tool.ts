import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coordinate: readonly number[];
  low: readonly number[];
  high: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coordinate", label: "coordinate", kind: "numberList" },
  { id: "low", label: "low", kind: "numberList" },
  { id: "high", label: "high", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.voxel(i.coordinate);
  H.voxelBox(i.low, i.high);
  return H.finish({
    inside: i.coordinate.every((x, j) => x >= i.low[j] && x < i.high[j]),
  });
};
export const example = {
  input: { coordinate: [2, 1, 1], low: [0, 0, 0], high: [2, 2, 2] },
  output: { result: { inside: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Voxel Box Contained Coordinate Check", "voxels", "3D geometry"],
    collections: ["data", "learn"],
    fields: ["voxel", "voxels", "3D geometry"],
    keywords: ["voxels", "3D geometry"],
  },
  id: "voxel/box-contained-coordinate-check",
  title: "Voxel Box Contained Coordinate Check",
  description:
    "Check integer cell coordinate membership in an explicit half-open 3D voxel box; upper faces are excluded, including empty boxes.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { inside: { type: "boolean" } },
        required: ["inside"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
