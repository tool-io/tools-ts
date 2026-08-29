import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleMultinomial } from "../advanced-samplers.js";

export const example = {
  input: { probabilities: [1, 2, 1], trials: 10, count: 3, seed: "tool.io" },
  output: {
    samples: [
      [2, 6, 2],
      [3, 4, 3],
      [2, 5, 3],
    ],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/multinomial-sampler",
  title: "Multinomial Distribution Sampler",
  description:
    "Draw category-count vectors for a fixed number of independent trials from caller-supplied nonnegative weights, normalized to probabilities.",
  inputs: [
    { id: "probabilities", kind: "numberList", label: "probabilities" },
    {
      id: "trials",
      kind: "integer",
      label: "trials",
      minimum: 0,
      maximum: 100000,
    },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [{ id: "samples", kind: "matrix", label: "samples" }],
  calculate: (input) =>
    sampleMultinomial(
      input.probabilities as number[],
      input.trials as number,
      input.count as number,
      input.seed as string,
    ),
});
export type MultinomialSamplerInput = Readonly<typeof example.input>;
export type MultinomialSamplerOutput = Readonly<typeof example.output>;
export const multinomialSamplerTool = tool;
export const runMultinomialSampler = tool.execute;
export default tool;
