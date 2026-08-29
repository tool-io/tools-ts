import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleFiniteMarkovChain } from "../advanced-samplers.js";

export const example = {
  input: {
    transition: [
      [0.8, 0.2],
      [0.3, 0.7],
    ],
    initialState: 0,
    count: 3,
    seed: "tool.io",
  },
  output: { samples: [0, 0, 0] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/mcmc-sampler",
  title: "Finite-State Markov Chain Monte Carlo Sampler",
  description:
    "Sample a finite-state Markov chain from a caller-supplied row-stochastic transition matrix and initial state. This samples the chain, not an arbitrary target distribution.",
  inputs: [
    { id: "transition", kind: "matrix", label: "transition" },
    { id: "initialState", kind: "integer", label: "initial State", minimum: 0 },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [{ id: "samples", kind: "numberList", label: "samples" }],
  calculate: (input) =>
    sampleFiniteMarkovChain(
      input.transition as number[][],
      input.initialState as number,
      input.count as number,
      input.seed as string,
    ),
});
export type McmcSamplerInput = Readonly<typeof example.input>;
export type McmcSamplerOutput = Readonly<typeof example.output>;
export const mcmcSamplerTool = tool;
export const runMcmcSampler = tool.execute;
export default tool;
