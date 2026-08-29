import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/cauchy-sampler",
  title: "Cauchy Distribution Sampler",
  description:
    "Sample a Cauchy distribution by inverse CDF from a seed. Cauchy samples have no finite mean or variance.",
  parameters: [
    { id: "location", kind: "number", label: "location" },
    { id: "scale", kind: "number", label: "scale", minimum: Number.MIN_VALUE },
  ],
  draw: (random, input) =>
    (input.location as number) +
    (input.scale as number) * Math.tan(Math.PI * (unitRandom(random) - 0.5)),
});
export const example = {
  input: { location: 0, scale: 1, count: 3, seed: "tool.io" },
  output: {
    samples: [-1.8992565616969603, 0.6522348440661826, -0.9679041632767517],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type CauchySamplerInput = Readonly<typeof example.input>;
export type CauchySamplerOutput = Readonly<typeof example.output>;
export const cauchySamplerTool = tool;
export const runCauchySampler = tool.execute;
export default tool;
