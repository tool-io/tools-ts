import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleNegativeBinomialPoissonMixture } from "../advanced-samplers.js";

export const example = {
  input: { shape: 2, successProbability: 0.5, count: 3, seed: "tool.io" },
  output: {
    rates: [0.8493906953521071, 0.9019786744319405, 1.232382082791261],
    samples: [0, 1, 0],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/negative-binomial-poisson-mixture-sampler",
  title: "Negative Binomial–Poisson Mixture Sampler",
  description:
    "Draw a gamma-distributed Poisson rate and then an exact Poisson count; marginal counts follow the negative-binomial gamma-Poisson mixture in the supported rate range.",
  inputs: [
    { id: "shape", kind: "number", label: "shape", minimum: 5e-324 },
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
  outputs: [
    { id: "rates", kind: "numberList", label: "rates" },
    { id: "samples", kind: "numberList", label: "samples" },
  ],
  calculate: (input) =>
    sampleNegativeBinomialPoissonMixture(
      input.shape as number,
      input.successProbability as number,
      input.count as number,
      input.seed as string,
    ),
});
export type NegativeBinomialPoissonMixtureSamplerInput = Readonly<
  typeof example.input
>;
export type NegativeBinomialPoissonMixtureSamplerOutput = Readonly<
  typeof example.output
>;
export const negativeBinomialPoissonMixtureSamplerTool = tool;
export const runNegativeBinomialPoissonMixtureSampler = tool.execute;
export default tool;
