import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleNegativeBinomial } from "../advanced-samplers.js";

export const example = {
  input: { successes: 3, successProbability: 0.5, count: 3, seed: "tool.io" },
  output: { samples: [1, 2, 8] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/negative-binomial-sampler",
  title: "Negative Binomial Distribution Sampler",
  description:
    "Draw the number of failures before a specified integer number of successes in independent Bernoulli trials.",
  inputs: [
    {
      id: "successes",
      kind: "integer",
      label: "successes",
      minimum: 1,
      maximum: 10000,
    },
    {
      id: "successProbability",
      kind: "number",
      label: "success Probability",
      minimum: 5e-324,
      maximum: 1,
    },
    { id: "count", kind: "integer", label: "count", minimum: 1, maximum: 1000 },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [{ id: "samples", kind: "numberList", label: "samples" }],
  calculate: (input) =>
    sampleNegativeBinomial(
      input.successes as number,
      input.successProbability as number,
      input.count as number,
      input.seed as string,
    ),
});
export type NegativeBinomialSamplerInput = Readonly<typeof example.input>;
export type NegativeBinomialSamplerOutput = Readonly<typeof example.output>;
export const negativeBinomialSamplerTool = tool;
export const runNegativeBinomialSampler = tool.execute;
export default tool;
