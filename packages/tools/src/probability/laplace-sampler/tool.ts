import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/laplace-sampler",
  title: "Laplace Distribution Sampler",
  description:
    "Draw Laplace samples from location and positive scale using the two-sided exponential inverse CDF.",
  parameters: [
    { id: "location", kind: "number", label: "location" },
    { id: "scale", kind: "number", label: "scale", minimum: Number.MIN_VALUE },
  ],
  draw: (random, input) =>
    (() => {
      const u = unitRandom(random) - 0.5;
      return (
        (input.location as number) -
        (input.scale as number) * Math.sign(u) * Math.log1p(-2 * Math.abs(u))
      );
    })(),
});
export const example = {
  input: { location: 0, scale: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [-1.1759331950431737, 0.4587567348765341, -0.6725955633402791],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type LaplaceSamplerInput = Readonly<typeof example.input>;
export type LaplaceSamplerOutput = Readonly<typeof example.output>;
export const laplaceSamplerTool = tool;
export const runLaplaceSampler = tool.execute;
export default tool;
