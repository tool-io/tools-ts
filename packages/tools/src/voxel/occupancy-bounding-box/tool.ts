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
  const p = H.voxels(i.coordinates);
  return H.finish({
    box: p.length
      ? {
          low: [0, 1, 2].map((j) => Math.min(...p.map((v) => v[j]))),
          high: [0, 1, 2].map((j) => Math.max(...p.map((v) => v[j])) + 1),
        }
      : null,
  });
};
export const example = {
  input: {
    coordinates: [
      [0, 0, 0],
      [1, 2, 3],
    ],
  },
  output: { result: { box: { low: [0, 0, 0], high: [2, 3, 4] } } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/occupancy-bounding-box",
  title: "Voxel Occupancy Bounding Box",
  description:
    "Compute a half-open integer cell envelope of explicit unique occupied voxels, adding one at inclusive maximum cells; empty occupancy has null box.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
