import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ dimensions: readonly number[]; halo: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dimensions", label: "dimensions", kind: "numberList" },
  { id: "halo", label: "halo", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.dimensions(i.dimensions);
  H.int(i.halo, 0, 1e6);
  const core = H.voxelVolume(i.dimensions),
    expanded = H.voxelVolume(i.dimensions.map((x) => x + 2 * i.halo));
  return H.finish({
    core: String(core),
    expanded: String(expanded),
    haloCells: String(expanded - core),
  });
};
export const example = {
  input: { dimensions: [2, 3, 4], halo: 1 },
  output: { result: { core: "24", expanded: "120", haloCells: "96" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "voxel/box-halo-cell-budget",
  title: "Voxel Box Halo Cell Budget",
  description:
    "Budget exact additional voxel cells for a symmetric integer halo around a supplied positive cuboid, counting edges/corners once; no boundary clipping or memory overhead.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
