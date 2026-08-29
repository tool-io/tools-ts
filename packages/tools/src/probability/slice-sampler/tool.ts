import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleSliceNormal } from "../advanced-samplers.js";

export const example = {
  input: { start: 0, width: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [-1.4080101868603379, 0.6885558580979705, 0.22716964571736753],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/slice-sampler",
  title: "Slice Sampler for Standard Normal",
  description:
    "Sample the standard normal density with univariate stepping-out and shrinkage slice sampling. Width controls exploration, not the target distribution.",
  inputs: [
    { id: "start", kind: "number", label: "start" },
    { id: "width", kind: "number", label: "width", minimum: 5e-324 },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [{ id: "samples", kind: "numberList", label: "samples" }],
  calculate: (input) =>
    sampleSliceNormal(
      input.start as number,
      input.width as number,
      input.count as number,
      input.seed as string,
    ),
});
export type SliceSamplerInput = Readonly<typeof example.input>;
export type SliceSamplerOutput = Readonly<typeof example.output>;
export const sliceSamplerTool = tool;
export const runSliceSampler = tool.execute;
export default tool;
