import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/f-sampler",
  title: "F-Distribution Sampler",
  description:
    "Draw an F ratio from two independent chi-square variates, each divided by its degrees of freedom.",
  parameters: [
    {
      id: "numeratorDegreesOfFreedom",
      kind: "number",
      label: "numerator Degrees Of Freedom",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "denominatorDegreesOfFreedom",
      kind: "number",
      label: "denominator Degrees Of Freedom",
      minimum: Number.MIN_VALUE,
    },
  ],
  draw: (random, input) =>
    (gammaSample((input.numeratorDegreesOfFreedom as number) / 2, random) * 2) /
    (input.numeratorDegreesOfFreedom as number) /
    ((gammaSample((input.denominatorDegreesOfFreedom as number) / 2, random) *
      2) /
      (input.denominatorDegreesOfFreedom as number)),
});
export const example = {
  input: {
    numeratorDegreesOfFreedom: 2,
    denominatorDegreesOfFreedom: 2,
    count: 3,
    seed: "tool.io",
  },
  output: {
    samples: [5.115425075744834, 1.3868768779403828, 1.1275904146975853],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type FSamplerInput = Readonly<typeof example.input>;
export type FSamplerOutput = Readonly<typeof example.output>;
export const fSamplerTool = tool;
export const runFSampler = tool.execute;
export default tool;
