import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly resolutions: readonly number[];
  readonly clusterCounts: readonly number[];
  readonly targetClusters: number;
}>;
export type Output = Readonly<{
  readonly selectedResolution: number;
  readonly selectedClusterCount: number;
  readonly clusterCountError: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.resolutions.length;
  if (
    n === 0 ||
    n !== input.clusterCounts.length ||
    input.clusterCounts.some((v) => v < 1 || !Number.isSafeInteger(v))
  )
    simpleError(
      "resolutions",
      "Aligned resolutions and integer cluster counts are required.",
    );
  let best = 0;
  for (let i = 1; i < n; i++)
    if (
      Math.abs(input.clusterCounts[i] - input.targetClusters) <
      Math.abs(input.clusterCounts[best] - input.targetClusters)
    )
      best = i;
  return {
    selectedResolution: input.resolutions[best],
    selectedClusterCount: input.clusterCounts[best],
    clusterCountError: Math.abs(
      input.clusterCounts[best] - input.targetClusters,
    ),
  };
};

export const exampleInput = {
  resolutions: [0.2, 0.5, 1],
  clusterCounts: [2, 4, 8],
  targetClusters: 5,
} satisfies Input;
export const exampleOutput = {
  selectedResolution: 0.5,
  selectedClusterCount: 4,
  clusterCountError: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/community-resolution-selector",
  title: "Community Resolution Selector",
  description:
    "Select a tested community resolution closest to the target cluster count.",
  inputs: [
    { id: "resolutions", kind: "numberList", label: "Resolutions" },
    { id: "clusterCounts", kind: "numberList", label: "Cluster counts" },
    { id: "targetClusters", kind: "number", label: "Target clusters" },
  ],
  outputs: [
    { id: "selectedResolution", kind: "number", label: "Selected resolution" },
    {
      id: "selectedClusterCount",
      kind: "number",
      label: "Selected cluster count",
    },
    { id: "clusterCountError", kind: "number", label: "Cluster count error" },
  ],
  calculate: (value) =>
    calculate({
      resolutions: value.resolutions as readonly number[],
      clusterCounts: value.clusterCounts as readonly number[],
      targetClusters: value.targetClusters as number,
    }),
});
export const run = tool.execute;
export default tool;
