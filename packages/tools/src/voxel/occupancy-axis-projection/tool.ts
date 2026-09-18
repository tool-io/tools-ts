import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coordinates: readonly (readonly number[])[];
  axis: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coordinates", label: "coordinates", kind: "matrix" },
  { id: "axis", label: "axis", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.voxels(i.coordinates);
  H.int(i.axis, 0, 2);
  return H.finish({
    projection: H.unique(
      p.map((v) => JSON.stringify(v.filter((_, j) => j !== i.axis))),
    ).map((s) => JSON.parse(s)),
  });
};
export const example = {
  input: {
    coordinates: [
      [0, 0, 0],
      [0, 0, 1],
      [1, 0, 0],
    ],
    axis: 2,
  },
  output: {
    result: {
      projection: [
        [0, 0],
        [1, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/occupancy-axis-projection",
  title: "Voxel Occupancy Axis Projection",
  description:
    "Project deduplicated explicit occupied voxel coordinates by dropping one axis, coalescing projected duplicates in first-appearance order; no depth, visibility or rendering model.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
