import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/exponential-sampler",
  title: "Exponential Distribution Sampler",
  description:
    "Draw waiting times using inverse CDF with a positive rate parameter; the mean is 1/rate.",
  parameters: [
    { id: "rate", kind: "number", label: "rate", minimum: Number.MIN_VALUE },
  ],
  draw: (random, input) =>
    -Math.log1p(-unitRandom(random)) / (input.rate as number),
});
export const example = {
  input: { rate: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [0.16754975453491439, 1.1519039154364794, 0.2946275552046435],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type ExponentialSamplerInput = Readonly<typeof example.input>;
export type ExponentialSamplerOutput = Readonly<typeof example.output>;
export const exponentialSamplerTool = tool;
export const runExponentialSampler = tool.execute;
export default tool;
