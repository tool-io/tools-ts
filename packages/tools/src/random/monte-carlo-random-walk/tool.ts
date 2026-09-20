import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { runCumulativeSum } from "../../list/cumulative-sum/tool.js";
import { calculatePopulationSummary } from "../../statistics/population-summary/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";

export type MonteCarloRandomWalkInput = {
  readonly steps: number;
  readonly pathCount: number;
  readonly startPosition: number;
  readonly positiveStepProbability: number;
  readonly seed?: number;
};
export type MonteCarloRandomWalkOutput = {
  readonly paths: readonly (readonly number[])[];
  readonly finalPositions: readonly number[];
  readonly endpointMean: number;
  readonly endpointPopulationVariance: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  additionalProperties: false,
  properties: {
    steps: { minimum: 1, maximum: 1024, type: "integer" },
    pathCount: {
      description:
        "Exact number of paths; pathCount × (steps + 1) must not exceed 16,384 retained positions.",
      minimum: 1,
      maximum: 32,
      type: "integer",
    },
    startPosition: { type: "integer" },
    positiveStepProbability: { minimum: 0, maximum: 1, type: "number" },
    seed: generatorSeedSchema,
  },
  required: ["steps", "pathCount", "startPosition", "positiveStepProbability"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    paths: {
      items: {
        items: { type: "integer" },
        minItems: 2,
        maxItems: 1025,
        type: "array",
      },
      minItems: 1,
      maxItems: 32,
      type: "array",
    },
    finalPositions: {
      items: { type: "integer" },
      minItems: 1,
      maxItems: 32,
      type: "array",
    },
    endpointMean: { type: "number" },
    endpointPopulationVariance: { minimum: 0, type: "number" },
    randomness: generatorReplaySchema,
  },
  required: [
    "paths",
    "finalPositions",
    "endpointMean",
    "endpointPopulationVariance",
    "randomness",
  ],
  type: "object",
} as const;
const isInput = (input: unknown): input is MonteCarloRandomWalkInput =>
  matchesModelInput(input, inputSchema);
export const calculateMonteCarloRandomWalk = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MonteCarloRandomWalkOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.pathCount * (input.steps + 1) > 16_384)
      simpleError(
        "pathCount",
        "The request exceeds 16,384 retained walk positions.",
        "resource_limit_exceeded",
      );
    const random = createGeneratorRandom(input.seed, context);
    const paths: number[][] = [],
      finalPositions: number[] = [];
    for (let path = 0; path < input.pathCount; path += 1) {
      const increments = Array.from({ length: input.steps }, () =>
        random.unit() < input.positiveStepProbability ? 1 : -1,
      );
      const cumulative = runCumulativeSum({ values: increments });
      if (!cumulative.ok)
        throw new Error("Bounded unit steps did not produce cumulative sums.");
      const positions = [
        input.startPosition,
        ...cumulative.output.sums.map((offset) => {
          const position = input.startPosition + offset;
          if (!Number.isSafeInteger(position))
            simpleError(
              "startPosition",
              "A generated position is outside the safe-integer range.",
              "unsafe_walk_position",
            );
          return position;
        }),
      ];
      paths.push(positions);
      finalPositions.push(positions[positions.length - 1]);
    }
    const summary = calculatePopulationSummary(finalPositions);
    if (summary === null)
      throw new Error(
        "Bounded safe-integer endpoints did not produce a population summary.",
      );
    return toolSuccess({
      paths,
      finalPositions,
      endpointMean: summary.mean,
      endpointPopulationVariance: summary.variance,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const monteCarloRandomWalkExample = {
  input: {
    steps: 6,
    pathCount: 3,
    startPosition: 2,
    positiveStepProbability: 0.5,
    seed: 42,
  },
  output: {
    paths: [
      [2, 1, 2, 1, 0, 1, 0],
      [2, 3, 2, 1, 2, 3, 2],
      [2, 1, 2, 3, 2, 1, 0],
    ],
    finalPositions: [0, 2, 0],
    endpointMean: 0.6666666666666667,
    endpointPopulationVariance: 0.888888888888889,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<MonteCarloRandomWalkInput, MonteCarloRandomWalkOutput>;
export const monteCarloRandomWalkTool = createModelDefinition<
  MonteCarloRandomWalkInput,
  MonteCarloRandomWalkOutput
>({
  id: "random/monte-carlo-random-walk",
  title: "One-Dimensional Monte Carlo Random Walk Simulator",
  description:
    "Simulate exact-count one-dimensional unit-step paths under an explicit forward-step probability, reusing cumulative sums and population endpoint summaries without predicting a real process.",
  inputSchema,
  outputSchema,
  execute: calculateMonteCarloRandomWalk,
});
export const runMonteCarloRandomWalk = monteCarloRandomWalkTool.execute;
export default monteCarloRandomWalkTool;
