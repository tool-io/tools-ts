import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleImportance } from "../advanced-samplers.js";

export const example = {
  input: { proposal: [1, 1], targetWeights: [1, 3], count: 3, seed: "tool.io" },
  output: { sampleIndices: [0, 1, 0], weights: [0.5, 1.5, 0.5] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/importance-sampler",
  title: "Discrete Importance Sampler",
  description:
    "Draw category indices from a proposal distribution and return target/proposal importance weights; proposal support must cover every positive target category.",
  inputs: [
    { id: "proposal", kind: "numberList", label: "proposal" },
    { id: "targetWeights", kind: "numberList", label: "target Weights" },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [
    { id: "sampleIndices", kind: "numberList", label: "sample Indices" },
    { id: "weights", kind: "numberList", label: "weights" },
  ],
  calculate: (input) =>
    sampleImportance(
      input.proposal as number[],
      input.targetWeights as number[],
      input.count as number,
      input.seed as string,
    ),
});
export type ImportanceSamplerInput = Readonly<typeof example.input>;
export type ImportanceSamplerOutput = Readonly<typeof example.output>;
export const importanceSamplerTool = tool;
export const runImportanceSampler = tool.execute;
export default tool;
