import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/weibull-sampler",
  title: "Weibull Distribution Sampler",
  description:
    "Draw nonnegative Weibull variates with positive shape and scale using the inverse CDF.",
  parameters: [
    { id: "shape", kind: "number", label: "shape", minimum: Number.MIN_VALUE },
    { id: "scale", kind: "number", label: "scale", minimum: Number.MIN_VALUE },
  ],
  draw: (random, input) =>
    (input.scale as number) *
    (-Math.log1p(-unitRandom(random))) ** (1 / (input.shape as number)),
});
export const example = {
  input: { shape: 2, scale: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [0.4093284189192272, 1.0732678675132687, 0.5427960530481439],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type WeibullSamplerInput = Readonly<typeof example.input>;
export type WeibullSamplerOutput = Readonly<typeof example.output>;
export const weibullSamplerTool = tool;
export const runWeibullSampler = tool.execute;
export default tool;
