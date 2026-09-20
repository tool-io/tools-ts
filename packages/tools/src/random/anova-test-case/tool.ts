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
  calculateOneWayAnova,
  oneWayAnovaTool,
  type OneWayAnovaOutput,
} from "../../statistics/one-way-anova/tool.js";
import { drawSyntheticNormal } from "../synthetic-normal-construction.js";
import { experimentSamplesSchema } from "../statistical-experiment-construction.js";

export type AnovaGroupModel = {
  readonly mean: number;
  readonly standardDeviation: number;
  readonly count: number;
};
export type AnovaTestCaseInput = {
  readonly groups: readonly AnovaGroupModel[];
  readonly seed?: number;
};
export type AnovaTestCaseOutput = {
  readonly models: readonly AnovaGroupModel[];
  readonly groups: readonly (readonly number[])[];
  readonly analysis: {
    readonly status: "finite" | "not-finite";
    readonly result: OneWayAnovaOutput | null;
  };
  readonly randomness: GeneratorReplay;
};
const modelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mean: { type: "number" },
    standardDeviation: { type: "number", minimum: 0 },
    count: { type: "integer", minimum: 2, maximum: 256 },
  },
  required: ["mean", "standardDeviation", "count"],
} as const;
const modelsSchema = {
  type: "array",
  minItems: 2,
  maxItems: 16,
  items: modelSchema,
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { groups: modelsSchema, seed: generatorSeedSchema },
  required: ["groups"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    models: modelsSchema,
    groups: {
      type: "array",
      minItems: 2,
      maxItems: 16,
      items: { ...experimentSamplesSchema, minItems: 2, maxItems: 256 },
    },
    analysis: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ["finite", "not-finite"] },
        result: { anyOf: [oneWayAnovaTool.outputSchema, { type: "null" }] },
      },
      required: ["status", "result"],
    },
    randomness: generatorReplaySchema,
  },
  required: ["models", "groups", "analysis", "randomness"],
} as const;

const isInput = (input: unknown): input is AnovaTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateAnovaTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<AnovaTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.groups.reduce((sum, group) => sum + group.count, 0) > 2048)
      simpleError(
        "groups",
        "The combined dataset is limited to 2048 observations.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const groups = input.groups.map((model) =>
      Array.from({ length: model.count }, () =>
        drawSyntheticNormal(
          model.mean,
          model.standardDeviation,
          random,
          "groups",
        ),
      ),
    );
    const result = calculateOneWayAnova(groups);
    const analysis: AnovaTestCaseOutput["analysis"] =
      result === null
        ? { status: "not-finite", result: null }
        : { status: "finite", result };
    return toolSuccess({
      models: input.groups,
      groups,
      analysis,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const anovaTestCaseExample = {
  input: {
    groups: [
      {
        mean: 0,
        standardDeviation: 1,
        count: 3,
      },
      {
        mean: 2,
        standardDeviation: 1,
        count: 3,
      },
    ],
    seed: 42,
  },
  output: {
    models: [
      {
        mean: 0,
        standardDeviation: 1,
        count: 3,
      },
      {
        mean: 2,
        standardDeviation: 1,
        count: 3,
      },
    ],
    groups: [
      [-0.956162229384149, -0.2730261048826104, -1.8416271847835968],
      [0.8591179290459758, 1.4705662062835847, 3.2285906730631044],
    ],
    analysis: {
      status: "finite",
      result: {
        betweenDegreesOfFreedom: 1,
        betweenSumSquares: 12.4101999799,
        fRatio: 11.6435201633,
        grandMean: 0.414576548224,
        groupMeans: [-1.02360517302, 1.85275826946],
        withinDegreesOfFreedom: 4,
        withinSumSquares: 4.26338420196,
      },
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<AnovaTestCaseInput, AnovaTestCaseOutput>;
export const anovaTestCaseTool = createModelDefinition<
  AnovaTestCaseInput,
  AnovaTestCaseOutput
>({
  id: "random/anova-test-case",
  title: "Random ANOVA Test Case Generator",
  description:
    "Generate independent normal groups from supplied group-specific means, deviations, and sizes, then delegate one-way ANOVA sums of squares and F ratio; retain 12-significant-digit summaries and explicit nonfinite/undefined cases, without fitting parameters or inventing p-values.",
  inputSchema,
  outputSchema,
  execute: calculateAnovaTestCase,
});
export const runAnovaTestCase = anovaTestCaseTool.execute;
export default anovaTestCaseTool;
