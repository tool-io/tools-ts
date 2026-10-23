import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ coordinate: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coordinate", label: "coordinate", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.voxel(i.coordinate);
  const offsets = [
    [-1, -1, -1],
    [0, -1, -1],
    [1, -1, -1],
    [-1, 0, -1],
    [0, 0, -1],
    [1, 0, -1],
    [-1, 1, -1],
    [0, 1, -1],
    [1, 1, -1],
    [-1, -1, 0],
    [0, -1, 0],
    [1, -1, 0],
    [-1, 0, 0],
    [1, 0, 0],
    [-1, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
    [-1, -1, 1],
    [0, -1, 1],
    [1, -1, 1],
    [-1, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    [-1, 1, 1],
    [0, 1, 1],
    [1, 1, 1],
  ];
  return H.finish({
    neighbors: offsets.map((v) => v.map((x, j) => x + i.coordinate[j])),
  });
};
export const example = {
  input: { coordinate: [0, 0, 0] },
  output: {
    result: {
      neighbors: [
        [-1, -1, -1],
        [0, -1, -1],
        [1, -1, -1],
        [-1, 0, -1],
        [0, 0, -1],
        [1, 0, -1],
        [-1, 1, -1],
        [0, 1, -1],
        [1, 1, -1],
        [-1, -1, 0],
        [0, -1, 0],
        [1, -1, 0],
        [-1, 0, 0],
        [1, 0, 0],
        [-1, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
        [-1, -1, 1],
        [0, -1, 1],
        [1, -1, 1],
        [-1, 0, 1],
        [0, 0, 1],
        [1, 0, 1],
        [-1, 1, 1],
        [0, 1, 1],
        [1, 1, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Voxel Twenty Six Neighbor List", "voxels", "3D geometry"],
    collections: ["data", "learn"],
    fields: ["voxel", "voxels", "3D geometry"],
    keywords: ["voxels", "3D geometry"],
  },
  id: "voxel/coordinate-twenty-six-neighbor-list",
  title: "Voxel Twenty Six Neighbor List",
  description:
    "Enumerate 26 integer voxel neighbors in z/y/x scan order on an unbounded lattice, excluding the center; no volume clipping, connectivity inference or geographic projection.",
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
          neighbors: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["neighbors"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
