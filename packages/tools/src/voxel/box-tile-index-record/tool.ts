import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coordinate: readonly number[];
  dimensions: readonly number[];
  tileSize: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coordinate", label: "coordinate", kind: "numberList" },
  { id: "dimensions", label: "dimensions", kind: "numberList" },
  { id: "tileSize", label: "tileSize", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.dimensions(i.dimensions);
  H.dimensions(i.tileSize);
  H.voxel(i.coordinate);
  i.coordinate.forEach((x, j) => H.int(x, 0, i.dimensions[j] - 1));
  const tile = i.coordinate.map((x, j) => Math.floor(x / i.tileSize[j]));
  return H.finish({
    tile,
    local: i.coordinate.map((x, j) => x % i.tileSize[j]),
    tileLow: tile.map((x, j) => x * i.tileSize[j]),
    tileHigh: tile.map((x, j) =>
      Math.min(i.dimensions[j], (x + 1) * i.tileSize[j]),
    ),
  });
};
export const example = {
  input: { coordinate: [4, 2, 1], dimensions: [5, 4, 3], tileSize: [3, 3, 2] },
  output: {
    result: {
      tile: [1, 0, 0],
      local: [1, 2, 1],
      tileLow: [3, 0, 0],
      tileHigh: [5, 3, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Voxel Box Tile Index Record", "voxels", "3D geometry"],
    collections: ["data", "learn"],
    fields: ["voxel", "voxels", "3D geometry"],
    keywords: ["voxels", "3D geometry"],
  },
  id: "voxel/box-tile-index-record",
  title: "Voxel Box Tile Index Record",
  description:
    "Map a bounded voxel to tile/local coordinates and clipped half-open edge-tile bounds under explicit positive tile dimensions.",
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
          tile: { type: "array", items: { type: "number" } },
          local: { type: "array", items: { type: "number" } },
          tileLow: { type: "array", items: { type: "number" } },
          tileHigh: { type: "array", items: { type: "number" } },
        },
        required: ["tile", "local", "tileLow", "tileHigh"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
