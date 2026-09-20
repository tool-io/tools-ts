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
import { sampleBetaDistribution } from "../../probability/beta-distribution-sampler/tool.js";
import { calculateBenjaminiHochberg } from "../../statistics/benjamini-hochberg/tool.js";
import { calculateBonferroniCorrection } from "../../statistics/bonferroni-correction/tool.js";
import {
  derivedExperimentSeed,
  experimentPositiveSchema,
  experimentProbabilitySchema,
} from "../statistical-experiment-construction.js";

export type MultipleTestingTestCaseInput = {
  readonly count: number;
  readonly betaAlpha: number;
  readonly betaBeta: number;
  readonly significanceLevel: number;
  readonly seed?: number;
};
export type MultipleTestingTestCaseOutput = {
  readonly model: {
    readonly betaAlpha: number;
    readonly betaBeta: number;
    readonly significanceLevel: number;
  };
  readonly samplerSeed: string;
  readonly probabilities: readonly number[];
  readonly benjaminiHochberg: readonly number[];
  readonly bonferroni: readonly number[];
  readonly decisions: {
    readonly unadjusted: readonly boolean[];
    readonly benjaminiHochberg: readonly boolean[];
    readonly bonferroni: readonly boolean[];
  };
  readonly randomness: GeneratorReplay;
};
const probabilitiesSchema = {
  type: "array",
  minItems: 1,
  maxItems: 512,
  items: experimentProbabilitySchema,
} as const;
const flagsSchema = {
  type: "array",
  minItems: 1,
  maxItems: 512,
  items: { type: "boolean" },
} as const;
const modelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    betaAlpha: experimentPositiveSchema,
    betaBeta: experimentPositiveSchema,
    significanceLevel: experimentProbabilitySchema,
  },
  required: ["betaAlpha", "betaBeta", "significanceLevel"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...modelSchema.properties,
    count: { type: "integer", minimum: 1, maximum: 512 },
    seed: generatorSeedSchema,
  },
  required: [...modelSchema.required, "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: modelSchema,
    samplerSeed: { type: "string", minLength: 1 },
    probabilities: probabilitiesSchema,
    benjaminiHochberg: probabilitiesSchema,
    bonferroni: probabilitiesSchema,
    decisions: {
      type: "object",
      additionalProperties: false,
      properties: {
        unadjusted: flagsSchema,
        benjaminiHochberg: flagsSchema,
        bonferroni: flagsSchema,
      },
      required: ["unadjusted", "benjaminiHochberg", "bonferroni"],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "model",
    "samplerSeed",
    "probabilities",
    "benjaminiHochberg",
    "bonferroni",
    "decisions",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is MultipleTestingTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateMultipleTestingTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MultipleTestingTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (!Number.isFinite(input.betaAlpha + input.betaBeta))
      simpleError(
        "betaAlpha",
        "The existing beta sampler cannot represent the shape sum.",
        "numeric_overflow",
      );
    const random = createGeneratorRandom(input.seed, context),
      samplerSeed = derivedExperimentSeed(random, "multiple-testing");
    const sample = sampleBetaDistribution(
      input.betaAlpha,
      input.betaBeta,
      input.count,
      samplerSeed,
    );
    if (
      sample === null ||
      sample.samples.some(
        (value) => !Number.isFinite(value) || value < 0 || value > 1,
      )
    )
      return simpleError(
        "betaAlpha",
        "The beta sampler could not produce a finite probability batch.",
        "sampler_failed",
      );
    const probabilities = sample.samples,
      bh = calculateBenjaminiHochberg({ pValues: probabilities });
    if (!bh.ok)
      throw new Error(
        "Validated synthetic probabilities were rejected by the BH core.",
      );
    const bonferroni = probabilities.map((pValue) => {
      const result = calculateBonferroniCorrection({
        comparisons: input.count,
        pValue,
      });
      if (!result.ok)
        throw new Error(
          "Validated synthetic probabilities were rejected by the Bonferroni core.",
        );
      return result.output.adjustedPValue;
    });
    const benjaminiHochberg = bh.output.adjustedPValues,
      flags = (values: readonly number[]): boolean[] =>
        values.map((value) => value <= input.significanceLevel);
    return toolSuccess({
      model: {
        betaAlpha: input.betaAlpha,
        betaBeta: input.betaBeta,
        significanceLevel: input.significanceLevel,
      },
      samplerSeed,
      probabilities,
      benjaminiHochberg,
      bonferroni,
      decisions: {
        unadjusted: flags(probabilities),
        benjaminiHochberg: flags(benjaminiHochberg),
        bonferroni: flags(bonferroni),
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const multipleTestingTestCaseExample = {
  input: {
    count: 4,
    betaAlpha: 2,
    betaBeta: 5,
    significanceLevel: 0.2,
    seed: 42,
  },
  output: {
    model: {
      betaAlpha: 2,
      betaBeta: 5,
      significanceLevel: 0.2,
    },
    samplerSeed: "multiple-testing:2581720956",
    probabilities: [
      0.365540836018, 0.172622514081, 0.406420307559, 0.402638240148,
    ],
    benjaminiHochberg: [
      0.406420307559, 0.406420307559, 0.406420307559, 0.406420307559,
    ],
    bonferroni: [1, 0.690490056324, 1, 1],
    decisions: {
      unadjusted: [false, true, false, false],
      benjaminiHochberg: [false, false, false, false],
      bonferroni: [false, false, false, false],
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  MultipleTestingTestCaseInput,
  MultipleTestingTestCaseOutput
>;
export const multipleTestingTestCaseTool = createModelDefinition<
  MultipleTestingTestCaseInput,
  MultipleTestingTestCaseOutput
>({
  id: "random/multiple-testing-test-case",
  title: "Random Multiple-Testing Test Case Generator",
  description:
    "Generate synthetic beta-distributed probability values with the existing 12-significant-digit sampler and apply delegated Benjamini–Hochberg and Bonferroni corrections, preserving original order and threshold decisions; these are not calibrated study p-values and no actual false-discovery-rate guarantee is inferred.",
  inputSchema,
  outputSchema,
  execute: calculateMultipleTestingTestCase,
});
export const runMultipleTestingTestCase = multipleTestingTestCaseTool.execute;
export default multipleTestingTestCaseTool;
