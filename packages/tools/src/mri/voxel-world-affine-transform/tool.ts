import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly voxelCoordinates: readonly (readonly number[])[];
  readonly voxelToWorldAffine: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly worldCoordinatesMm: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "voxelCoordinates", label: "Voxel coordinates", kind: "matrix" },
  { id: "voxelToWorldAffine", label: "Voxel to world affine", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = input.voxelToWorldAffine;
  if (
    a.length !== 4 ||
    a.some((row) => row.length !== 4) ||
    a[3].some((v, i) => v !== (i === 3 ? 1 : 0)) ||
    !input.voxelCoordinates.length ||
    input.voxelCoordinates.some((row) => row.length !== 3)
  )
    simpleError(
      "voxelToWorldAffine",
      "A homogeneous 4×4 affine and three-component voxel coordinates required.",
    );
  const det =
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
  if (det === 0)
    simpleError("voxelToWorldAffine", "Nonsingular spatial affine required.");
  return {
    worldCoordinatesMm: input.voxelCoordinates.map((row) =>
      a.slice(0, 3).map((r) => r[3] + row.reduce((s, v, i) => s + r[i] * v, 0)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  voxelCoordinates: [
    [0, 0, 0],
    [1, 2, 3],
  ],
  voxelToWorldAffine: [
    [2, 0, 0, 10],
    [0, 3, 0, 20],
    [0, 0, 4, 30],
    [0, 0, 0, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  worldCoordinatesMm: [
    [10, 20, 30],
    [12, 26, 42],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/voxel-world-affine-transform",
  title: "Affine Spatial Normalization",
  description:
    "Apply a supplied nonsingular voxel-to-world image affine including translations; voxel indexing and world-axis convention must match the image header, and registration is not fitted.",
  inputs: inputFields,
  outputs: [
    {
      id: "worldCoordinatesMm",
      label: "World coordinates mm",
      kind: "matrix",
      unit: "mm",
    },
  ],
  calculate: (value) =>
    calculate({
      voxelCoordinates:
        value.voxelCoordinates as readonly (readonly number[])[],
      voxelToWorldAffine:
        value.voxelToWorldAffine as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
