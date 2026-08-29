import type { ToolExample } from "../../core/example.js";
import { simpleError } from "../../core/simple.js";
import {
  createDistributionSampler,
  unitRandom,
  gammaSample,
  normalSample,
} from "../distribution-sampler.js";

export const tool = createDistributionSampler({
  id: "probability/uniform-discrete-sampler",
  title: "Uniform Discrete Distribution Sampler",
  description:
    "Draw each integer in an inclusive safe-integer range with equal nominal probability using a seeded pseudorandom source.",
  parameters: [
    { id: "minimum", kind: "integer", label: "minimum" },
    { id: "maximum", kind: "integer", label: "maximum" },
  ],
  validate: (input) => {
    if (
      (input.maximum as number) < (input.minimum as number) ||
      (input.maximum as number) - (input.minimum as number) > 0xffffffff
    )
      simpleError("maximum", "Range must be ordered and no wider than 2^32.");
  },
  draw: (random, input) =>
    (input.minimum as number) +
    Math.floor(
      unitRandom(random) *
        ((input.maximum as number) - (input.minimum as number) + 1),
    ),
});
export const example = {
  input: { minimum: 1, maximum: 6, count: 3, seed: "tool.io" },
  output: { samples: [1, 5, 2] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export type UniformDiscreteSamplerInput = Readonly<typeof example.input>;
export type UniformDiscreteSamplerOutput = Readonly<typeof example.output>;
export const uniformDiscreteSamplerTool = tool;
export const runUniformDiscreteSampler = tool.execute;
export default tool;
