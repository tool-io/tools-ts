import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { meanShift } from "../iterative-core.js";

export const example = {
  input: { points: [[0], [1], [10], [11]], bandwidth: 2, maxIterations: 100 },
  output: { modes: [[0.5], [10.5]], labels: [0, 0, 1, 1] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "clustering/mean-shift",
  title: "Mean Shift Clustering Tool",
  description:
    "Shift each point to the mean of points within a fixed Euclidean bandwidth, then merge nearby modes. Bandwidth controls the number of modes.",
  inputs: [
    { id: "points", kind: "matrix", label: "points" },
    { id: "bandwidth", kind: "number", label: "bandwidth", minimum: 5e-324 },
    {
      id: "maxIterations",
      kind: "integer",
      label: "max Iterations",
      minimum: 1,
      maximum: 1000,
    },
  ],
  outputs: [
    { id: "modes", kind: "matrix", label: "modes" },
    { id: "labels", kind: "numberList", label: "labels" },
  ],
  calculate: (input) =>
    meanShift(
      input.points as number[][],
      input.bandwidth as number,
      input.maxIterations as number,
    ),
});
export type MeanShiftInput = Readonly<typeof example.input>;
export type MeanShiftOutput = Readonly<typeof example.output>;
export const meanShiftTool = tool;
export const runMeanShift = tool.execute;
export default tool;
