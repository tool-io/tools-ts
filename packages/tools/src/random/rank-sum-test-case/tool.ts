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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  calculateMannWhitneyU,
  mannWhitneyUTool,
  type MannWhitneyUOutput,
} from "../../statistics/mann-whitney-u/tool.js";

export type RankSumSampleModel = {
  readonly count: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly step: number;
};
export type RankSumTestCaseInput = {
  readonly first: RankSumSampleModel;
  readonly second: RankSumSampleModel;
  readonly seed?: number;
};
export type RankSumTestCaseOutput = {
  readonly models: {
    readonly first: RankSumSampleModel;
    readonly second: RankSumSampleModel;
  };
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly crossSampleTiePairs: number;
  readonly analysis: MannWhitneyUOutput;
  readonly randomness: GeneratorReplay;
};
const modelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1, maximum: 512 },
    minimum: { type: "integer" },
    maximum: { type: "integer" },
    step: { type: "integer", minimum: 1 },
  },
  required: ["count", "minimum", "maximum", "step"],
} as const;
const samplesSchema = {
  type: "array",
  minItems: 1,
  maxItems: 512,
  items: { type: "integer" },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: modelSchema,
    second: modelSchema,
    seed: generatorSeedSchema,
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    models: {
      type: "object",
      additionalProperties: false,
      properties: { first: modelSchema, second: modelSchema },
      required: ["first", "second"],
    },
    first: samplesSchema,
    second: samplesSchema,
    crossSampleTiePairs: { type: "integer", minimum: 0, maximum: 262144 },
    analysis: mannWhitneyUTool.outputSchema,
    randomness: generatorReplaySchema,
  },
  required: [
    "models",
    "first",
    "second",
    "crossSampleTiePairs",
    "analysis",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is RankSumTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateRankSumTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RankSumTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const sizes = [input.first, input.second].map((model) => {
      if (model.minimum > model.maximum)
        simpleError(
          "maximum",
          "Integer lattice bounds must be ordered.",
          "invalid_integer_range",
        );
      const size =
        (BigInt(model.maximum) - BigInt(model.minimum)) / BigInt(model.step) +
        1n;
      if (size > BigInt(Number.MAX_SAFE_INTEGER))
        simpleError(
          "step",
          "The lattice population must fit the existing integer draw core's safe range.",
          "unrepresentable_lattice_size",
        );
      return Number(size);
    });
    const random = createGeneratorRandom(input.seed, context);
    const draw = (model: RankSumSampleModel, size: number): number[] =>
      Array.from({ length: model.count }, () =>
        Number(
          BigInt(model.minimum) +
            BigInt(model.step) * BigInt(random.integer(0, size - 1)),
        ),
      );
    const first = draw(input.first, sizes[0]),
      second = draw(input.second, sizes[1]),
      result = calculateMannWhitneyU({ first, second });
    if (!result.ok)
      throw new Error(
        "Generated bounded integer samples were rejected by the Mann–Whitney core.",
      );
    let crossSampleTiePairs = 0;
    for (const a of first)
      for (const b of second) if (a === b) crossSampleTiePairs += 1;
    return toolSuccess({
      models: { first: input.first, second: input.second },
      first,
      second,
      crossSampleTiePairs,
      analysis: result.output,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const rankSumTestCaseExample = {
  input: {
    first: {
      count: 4,
      minimum: 0,
      maximum: 2,
      step: 1,
    },
    second: {
      count: 3,
      minimum: 1,
      maximum: 3,
      step: 1,
    },
    seed: 42,
  },
  output: {
    models: {
      first: {
        count: 4,
        minimum: 0,
        maximum: 2,
        step: 1,
      },
      second: {
        count: 3,
        minimum: 1,
        maximum: 3,
        step: 1,
      },
    },
    first: [1, 1, 2, 2],
    second: [1, 2, 1],
    crossSampleTiePairs: 6,
    analysis: {
      firstU: 7,
      secondU: 5,
      statistic: 5,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<RankSumTestCaseInput, RankSumTestCaseOutput>;
export const rankSumTestCaseTool = createModelDefinition<
  RankSumTestCaseInput,
  RankSumTestCaseOutput
>({
  id: "random/rank-sum-test-case",
  title: "Random Rank-Sum Test Case Generator",
  description:
    "Generate independent samples on caller-specified inclusive integer lattices, controlling ties and range separation, and delegate tie-aware Mann–Whitney U statistics; report cross-sample tie pairs and model ranges without inventing p-values or a continuous-distribution assumption.",
  inputSchema,
  outputSchema,
  execute: calculateRankSumTestCase,
});
export const runRankSumTestCase = rankSumTestCaseTool.execute;
export default rankSumTestCaseTool;
