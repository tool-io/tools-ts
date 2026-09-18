import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ coordinates: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coordinates", label: "coordinates", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.voxels(i.coordinates),
    keys = new Set(p.map((v) => JSON.stringify(v))),
    offsets = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];
  return H.finish({
    exposedFaces: p.reduce(
      (s, v) =>
        s +
        offsets.filter(
          (d) => !keys.has(JSON.stringify(v.map((x, j) => x + d[j]))),
        ).length,
      0,
    ),
  });
};
export const example = {
  input: {
    coordinates: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
    ],
  },
  output: { result: { exposedFaces: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/occupancy-surface-face-count",
  title: "Voxel Occupancy Surface Face Count",
  description:
    "Count unit faces exposed by a deduplicated explicit voxel occupancy set, subtracting shared orthogonal faces; no meshing, physical scale or cavity exterior flood-fill.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
