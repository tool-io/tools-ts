import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import {
  validateEdges,
  nearEdge,
  binOf,
} from "../m500b-charts-math-graphs-bins.js";
import { runSortNumbers } from "../../list/sort-numbers/tool.js";

export type HistogramBinEdgeChallengeInput = {
  readonly edges: readonly number[];
  readonly epsilon: number;
  readonly count: number;
  readonly closed: "left" | "right";
  readonly seed?: number;
};
export type HistogramBinEdgeChallengeOutput = {
  readonly observations: readonly number[];
  readonly sorted: readonly number[];
  readonly bins: readonly number[];
  readonly counts: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    edges: array(integer, 17, 2),
    epsilon: { type: "integer", minimum: 1 },
    count: { type: "integer", minimum: 1, maximum: 64 },
    closed: { type: "string", enum: ["left", "right"] },
    seed: generatorSeedSchema,
  },
  ["edges", "epsilon", "count", "closed"],
);
export const outputSchema = object({
  observations: array(integer, 64, 1),
  sorted: array(integer, 64, 1),
  bins: array(integer, 64, 1),
  counts: array(integer, 16, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is HistogramBinEdgeChallengeInput =>
  matchesModelInput(value, inputSchema);
export const calculateHistogramBinEdgeChallenge = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HistogramBinEdgeChallengeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    validateEdges(input.edges, input.epsilon);
    const observations = Array.from({ length: input.count }, () =>
        nearEdge(input.edges, input.epsilon, random),
      ),
      bins = observations.map((v) => binOf(v, input.edges, input.closed)),
      counts = input.edges
        .slice(1)
        .map((_, i) => bins.filter((b) => b === i).length),
      sorted = core(runSortNumbers({ values: observations })).values;
    const result = { observations, sorted, bins, counts };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const histogramBinEdgeChallengeExample = {
  input: { edges: [0, 10, 20], epsilon: 1, count: 2, closed: "left", seed: 42 },
  output: {
    observations: [10, 21],
    sorted: [10, 21],
    bins: [1, -1],
    counts: [0, 1],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HistogramBinEdgeChallengeInput,
  HistogramBinEdgeChallengeOutput
>;
export const histogramBinEdgeChallengeTool = createModelDefinition<
  HistogramBinEdgeChallengeInput,
  HistogramBinEdgeChallengeOutput
>({
  id: "random/histogram-bin-edge-challenge",
  title: "Random Histogram Bin Edge Challenge Generator",
  description:
    "Generate observations exactly on or one supplied epsilon around explicit bin edges, retaining endpoint-policy membership and outside labels.",
  inputSchema,
  outputSchema,
  execute: calculateHistogramBinEdgeChallenge,
});
export const runHistogramBinEdgeChallenge =
  histogramBinEdgeChallengeTool.execute;
export default histogramBinEdgeChallengeTool;
