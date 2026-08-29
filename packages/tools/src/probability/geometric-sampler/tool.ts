import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/geometric-sampler",
  title: "Geometric Distribution Sampler",
  description:
    "Draw the number of Bernoulli trials until the first success, including the successful trial. Success probability p is in (0,1].",
  parameters: [
    {
      id: "successProbability",
      kind: "number",
      label: "success Probability",
      minimum: Number.MIN_VALUE,
      maximum: 1,
    },
  ],
  draw: (random, input) =>
    Math.floor(
      Math.log1p(-unitRandom(random)) /
        Math.log1p(-(input.successProbability as number)),
    ) + 1,
});
export const example = {
  input: { successProbability: 0.5, count: 3, seed: "tool.io" },
  output: { samples: [1, 2, 1] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type GeometricSamplerInput = Readonly<typeof example.input>;
export type GeometricSamplerOutput = Readonly<typeof example.output>;
export const geometricSamplerTool = tool;
export const runGeometricSampler = tool.execute;
export default tool;
