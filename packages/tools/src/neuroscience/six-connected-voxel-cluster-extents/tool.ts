import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, components } from "../shared.js";
export type Input = Readonly<{
  readonly voxelStatistics: readonly number[];
  readonly dimensions: readonly number[];
  readonly threshold: number;
  readonly voxelVolumeMm3: number;
}>;
export type Output = Readonly<{
  readonly clusterVoxelCounts: readonly number[];
  readonly clusterVolumesMm3: readonly number[];
  readonly largestClusterVoxelCount: number;
}>;
const inputFields = [
  { id: "voxelStatistics", label: "Voxel statistics", kind: "numberList" },
  { id: "dimensions", label: "Dimensions", kind: "numberList" },
  { id: "threshold", label: "Threshold", kind: "number" },
  { id: "voxelVolumeMm3", label: "Voxel volume mm3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.threshold, "threshold");
  positive(input.voxelVolumeMm3, "voxelVolumeMm3");
  const clusters = components(
      input.voxelStatistics,
      input.dimensions,
      input.threshold,
    ),
    clusterVoxelCounts = clusters.map((row) => row.length);
  return {
    clusterVoxelCounts,
    clusterVolumesMm3: clusterVoxelCounts.map((v) => v * input.voxelVolumeMm3),
    largestClusterVoxelCount: clusterVoxelCounts.length
      ? Math.max(...clusterVoxelCounts)
      : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  voxelStatistics: [2, 2, 0, 3],
  dimensions: [4, 1, 1],
  threshold: 1,
  voxelVolumeMm3: 2,
} satisfies Input;
export const exampleOutput = {
  clusterVoxelCounts: [2, 1],
  clusterVolumesMm3: [4, 2],
  largestClusterVoxelCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/six-connected-voxel-cluster-extents",
  title: "Cluster Extent",
  description:
    "Find face-connected 3D suprathreshold voxel components using inclusive thresholding, x-fastest flattening and a supplied voxel volume; no inferential cluster p-values are produced.",
  inputs: inputFields,
  outputs: [
    {
      id: "clusterVoxelCounts",
      label: "Cluster voxel counts",
      kind: "numberList",
    },
    {
      id: "clusterVolumesMm3",
      label: "Cluster volumes mm3",
      kind: "numberList",
    },
    {
      id: "largestClusterVoxelCount",
      label: "Largest cluster voxel count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      voxelStatistics: value.voxelStatistics as readonly number[],
      dimensions: value.dimensions as readonly number[],
      threshold: value.threshold as number,
      voxelVolumeMm3: value.voxelVolumeMm3 as number,
    }),
});
export const run = tool.execute;
export default tool;
