import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../core/simple.js";
import {
  createSeededRandom,
  type RandomSource,
} from "../random/seeded-number/tool.js";
import { randomNormal } from "./normal-box-muller-sampler/tool.js";
import { randomGamma } from "./gamma-sampler/tool.js";

export { randomGamma, randomNormal };
export type { RandomSource };

export const unitRandom = (random: RandomSource): number => {
  const value = random();
  if (!(value >= 0 && value < 1))
    simpleError("seed", "Random source returned a value outside [0,1).");
  return Math.max(Number.MIN_VALUE, value);
};

export const normalSample = (random: RandomSource): number => {
  const value = randomNormal(random);
  if (value === null)
    return simpleError("seed", "Could not generate a normal variate.");
  return value;
};

export const gammaSample = (shape: number, random: RandomSource): number => {
  const value = randomGamma(shape, random);
  if (value === null || !Number.isFinite(value))
    return simpleError("shape", "Could not generate a gamma variate.");
  return value;
};

export const createDistributionSampler = (config: {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly parameters: readonly SimpleField[];
  readonly validate?: (input: Readonly<Record<string, unknown>>) => void;
  readonly draw: (
    random: RandomSource,
    input: Readonly<Record<string, unknown>>,
  ) => number;
}) =>
  createSimpleTool({
    id: config.id,
    title: config.title,
    description: config.description,
    inputs: [
      ...config.parameters,
      {
        id: "count",
        kind: "integer",
        label: "Sample count",
        minimum: 1,
        maximum: 10000,
      },
      { id: "seed", kind: "string", label: "Seed" },
    ],
    outputs: [{ id: "samples", kind: "numberList", label: "Samples" }],
    calculate: (input) => {
      if (!(input.seed as string).trim())
        simpleError("seed", "Seed must be nonempty.");
      config.validate?.(input);
      const random = createSeededRandom(input.seed as string);
      const samples: number[] = [];
      for (let index = 0; index < (input.count as number); index += 1) {
        const value = config.draw(random, input);
        if (!Number.isFinite(value))
          simpleError("count", "Sample lies outside the finite numeric range.");
        samples.push(value);
      }
      return { samples };
    },
  });
