import type { ToolExample } from "../../core/example.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/t-sampler",
  title: "Student T-Distribution Sampler",
  description:
    "Draw Student-t samples as standard normal divided by the square root of an independent chi-square ratio.",
  parameters: [
    {
      id: "degreesOfFreedom",
      kind: "number",
      label: "degrees Of Freedom",
      minimum: Number.MIN_VALUE,
    },
  ],
  draw: (random, input) =>
    normalSample(random) /
    Math.sqrt(
      (2 * gammaSample((input.degreesOfFreedom as number) / 2, random)) /
        (input.degreesOfFreedom as number),
    ),
});
export const example = {
  input: { degreesOfFreedom: 3, count: 3, seed: "tool.io" },
  output: {
    samples: [-0.5637855223881777, 1.9623639133959956, 0.13108203394531173],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type TSamplerInput = Readonly<typeof example.input>;
export type TSamplerOutput = Readonly<typeof example.output>;
export const tSamplerTool = tool;
export const runTSampler = tool.execute;
export default tool;
