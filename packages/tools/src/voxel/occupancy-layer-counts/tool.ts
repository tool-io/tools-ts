import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coordinates: readonly (readonly number[])[];
  axis: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coordinates", label: "coordinates", kind: "matrix" },
  { id: "axis", label: "axis", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.voxels(i.coordinates);
  H.int(i.axis, 0, 2);
  return H.finish({
    layers: H.groups(p, (v) => String(v[i.axis])).map((g) => ({
      coordinate: Number(g.key),
      count: g.indexes.length,
    })),
  });
};
export const example = {
  input: {
    coordinates: [
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 1],
    ],
    axis: 2,
  },
  output: {
    result: {
      layers: [
        { coordinate: 0, count: 1 },
        { coordinate: 1, count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Voxel Occupancy Layer Counts", "voxels", "3D geometry"],
    collections: ["data", "learn"],
    fields: ["voxel", "voxels", "3D geometry"],
    keywords: ["voxels", "3D geometry"],
  },
  id: "voxel/occupancy-layer-counts",
  title: "Voxel Occupancy Layer Counts",
  description:
    "Count unique occupied voxel cells per explicit axis layer, distinguishing occupancy from duplicated observation records; layer order follows first appearance.",
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
          layers: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                coordinate: { type: "number" },
                count: { type: "number" },
              },
              required: ["coordinate", "count"],
            },
          },
        },
        required: ["layers"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
