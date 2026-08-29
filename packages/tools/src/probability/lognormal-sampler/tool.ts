import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/lognormal-sampler",
  title: "Lognormal Distribution Sampler",
  description:
    "Exponentiate a normally distributed variate with log-space mean μ and standard deviation σ; μ is not the arithmetic mean of samples.",
  parameters: [
    { id: "logMean", kind: "number", label: "log Mean" },
    {
      id: "logStandardDeviation",
      kind: "number",
      label: "log Standard Deviation",
      minimum: 0,
    },
  ],
  draw: (random, input) =>
    Math.exp(
      (input.logMean as number) +
        (input.logStandardDeviation as number) * normalSample(random),
    ),
});
export const example = {
  input: { logMean: 0, logStandardDeviation: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [0.4586922189918711, 3.102308286044946, 0.488309680845671],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type LognormalSamplerInput = Readonly<typeof example.input>;
export type LognormalSamplerOutput = Readonly<typeof example.output>;
export const lognormalSamplerTool = tool;
export const runLognormalSampler = tool.execute;
export default tool;
