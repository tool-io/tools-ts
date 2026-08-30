import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, components } from "../shared.js";
export type Input = Readonly<{
  readonly voxelStatistics: readonly number[];
  readonly dimensions: readonly number[];
  readonly threshold: number;
}>;
export type Output = Readonly<{
  readonly clusterMasses: readonly number[];
  readonly clusterExcessMasses: readonly number[];
  readonly clusterPeakStatistics: readonly number[];
}>;
const inputFields = [
  { id: "voxelStatistics", label: "Voxel statistics", kind: "numberList" },
  { id: "dimensions", label: "Dimensions", kind: "numberList" },
  { id: "threshold", label: "Threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.threshold, "threshold");
  const clusters = components(
    input.voxelStatistics,
    input.dimensions,
    input.threshold,
  );
  return {
    clusterMasses: clusters.map((row) =>
      row.reduce((s, i) => s + input.voxelStatistics[i], 0),
    ),
    clusterExcessMasses: clusters.map((row) =>
      row.reduce((s, i) => s + input.voxelStatistics[i] - input.threshold, 0),
    ),
    clusterPeakStatistics: clusters.map((row) =>
      Math.max(...row.map((i) => input.voxelStatistics[i])),
    ),
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
} satisfies Input;
export const exampleOutput = {
  clusterMasses: [4, 3],
  clusterExcessMasses: [2, 2],
  clusterPeakStatistics: [2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/six-connected-voxel-cluster-masses",
  title: "Cluster Mass",
  description:
    "Compute raw statistic mass, threshold-excess mass and peak for face-connected suprathreshold clusters; conventions are explicit and no null distribution is invented.",
  inputs: inputFields,
  outputs: [
    { id: "clusterMasses", label: "Cluster masses", kind: "numberList" },
    {
      id: "clusterExcessMasses",
      label: "Cluster excess masses",
      kind: "numberList",
    },
    {
      id: "clusterPeakStatistics",
      label: "Cluster peak statistics",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      voxelStatistics: value.voxelStatistics as readonly number[],
      dimensions: value.dimensions as readonly number[],
      threshold: value.threshold as number,
    }),
});
export const run = tool.execute;
export default tool;
