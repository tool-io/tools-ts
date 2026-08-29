import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/gumbel-sampler",
  title: "Gumbel Distribution Sampler",
  description:
    "Draw Gumbel maximum-distribution samples from location and positive scale using inverse CDF.",
  parameters: [
    { id: "location", kind: "number", label: "location" },
    { id: "scale", kind: "number", label: "scale", minimum: Number.MIN_VALUE },
  ],
  draw: (random, input) =>
    (input.location as number) -
    (input.scale as number) * Math.log(-Math.log(unitRandom(random))),
});
export const example = {
  input: { location: 0, scale: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [-0.6254465321518143, 0.9679846554829021, -0.31169841537474363],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type GumbelSamplerInput = Readonly<typeof example.input>;
export type GumbelSamplerOutput = Readonly<typeof example.output>;
export const gumbelSamplerTool = tool;
export const runGumbelSampler = tool.execute;
export default tool;
