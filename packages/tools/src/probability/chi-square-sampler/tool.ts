import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/chi-square-sampler",
  title: "Chi-Square Distribution Sampler",
  description:
    "Sample chi-square variates as gamma(shape=df/2, scale=2) with positive degrees of freedom.",
  parameters: [
    {
      id: "degreesOfFreedom",
      kind: "number",
      label: "degrees Of Freedom",
      minimum: Number.MIN_VALUE,
    },
  ],
  draw: (random, input) =>
    2 * gammaSample((input.degreesOfFreedom as number) / 2, random),
});
export const example = {
  input: { degreesOfFreedom: 2, count: 3, seed: "tool.io" },
  output: {
    samples: [0.422620086335756, 0.08261680702541034, 1.1301789797253339],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type ChiSquareSamplerInput = Readonly<typeof example.input>;
export type ChiSquareSamplerOutput = Readonly<typeof example.output>;
export const chiSquareSamplerTool = tool;
export const runChiSquareSampler = tool.execute;
export default tool;
