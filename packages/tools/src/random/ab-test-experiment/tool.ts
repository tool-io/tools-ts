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
import { sampleBinomial } from "../../probability/binomial-sampler/tool.js";
import {
  calculateAbTest,
  abTestTool,
  type AbTestOutput,
} from "../../statistics/ab-test/tool.js";
import {
  derivedExperimentSeed,
  experimentProbabilitySchema,
} from "../statistical-experiment-construction.js";

export type AbTestExperimentInput = {
  readonly experimentCount: number;
  readonly visitorsA: number;
  readonly visitorsB: number;
  readonly probabilityA: number;
  readonly probabilityB: number;
  readonly confidenceLevel: number;
  readonly seed?: number;
};
export type AbTestExperimentOutput = {
  readonly model: {
    readonly visitorsA: number;
    readonly visitorsB: number;
    readonly probabilityA: number;
    readonly probabilityB: number;
    readonly confidenceLevel: number;
  };
  readonly samplerSeeds: { readonly a: string; readonly b: string };
  readonly experiments: readonly {
    readonly conversionsA: number;
    readonly conversionsB: number;
    readonly analysis: AbTestOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const modelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitorsA: { type: "integer", minimum: 1, maximum: 1000000 },
    visitorsB: { type: "integer", minimum: 1, maximum: 1000000 },
    probabilityA: experimentProbabilitySchema,
    probabilityB: experimentProbabilitySchema,
    confidenceLevel: {
      type: "number",
      exclusiveMinimum: 0,
      exclusiveMaximum: 1,
    },
  },
  required: [
    "visitorsA",
    "visitorsB",
    "probabilityA",
    "probabilityB",
    "confidenceLevel",
  ],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...modelSchema.properties,
    experimentCount: { type: "integer", minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  required: [...modelSchema.required, "experimentCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: modelSchema,
    samplerSeeds: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "string", minLength: 1 },
        b: { type: "string", minLength: 1 },
      },
      required: ["a", "b"],
    },
    experiments: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          conversionsA: { type: "integer", minimum: 0 },
          conversionsB: { type: "integer", minimum: 0 },
          analysis: abTestTool.outputSchema,
        },
        required: ["conversionsA", "conversionsB", "analysis"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["model", "samplerSeeds", "experiments", "randomness"],
} as const;

const isInput = (input: unknown): input is AbTestExperimentInput =>
  matchesModelInput(input, inputSchema);
export const calculateAbTestExperiment = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<AbTestExperimentOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.experimentCount * (input.visitorsA + input.visitorsB) > 1000000)
      simpleError(
        "experimentCount",
        "The experiment is limited to one million Bernoulli trial iterations.",
        "resource_limit",
      );
    const criticalProbability = 1 - (1 - input.confidenceLevel) / 2;
    if (!(criticalProbability > 0.5 && criticalProbability < 1))
      simpleError(
        "confidenceLevel",
        "Confidence tails are not distinguishable at floating-point precision.",
        "unrepresentable_confidence",
      );
    const random = createGeneratorRandom(input.seed, context),
      samplerSeeds = {
        a: derivedExperimentSeed(random, "ab-A"),
        b: derivedExperimentSeed(random, "ab-B"),
      };
    const first = sampleBinomial(
        input.visitorsA,
        input.probabilityA,
        input.experimentCount,
        samplerSeeds.a,
      ),
      second = sampleBinomial(
        input.visitorsB,
        input.probabilityB,
        input.experimentCount,
        samplerSeeds.b,
      );
    if (first === null || second === null)
      throw new Error(
        "Validated bounded A/B samples were rejected by the binomial core.",
      );
    const experiments = first.map((conversionsA, i) => {
      const conversionsB = second[i],
        analysis = calculateAbTest({
          conversionsA,
          conversionsB,
          visitorsA: input.visitorsA,
          visitorsB: input.visitorsB,
          confidenceLevel: input.confidenceLevel,
        });
      if (
        Object.values(analysis).some(
          (value) => typeof value === "number" && !Number.isFinite(value),
        )
      )
        simpleError(
          "confidenceLevel",
          "A delegated test summary is not finite.",
          "numeric_overflow",
        );
      return { conversionsA, conversionsB, analysis };
    });
    return toolSuccess({
      model: {
        visitorsA: input.visitorsA,
        visitorsB: input.visitorsB,
        probabilityA: input.probabilityA,
        probabilityB: input.probabilityB,
        confidenceLevel: input.confidenceLevel,
      },
      samplerSeeds,
      experiments,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const abTestExperimentExample = {
  input: {
    experimentCount: 4,
    visitorsA: 1,
    visitorsB: 1,
    probabilityA: 0.5,
    probabilityB: 0.5,
    confidenceLevel: 0.95,
    seed: 42,
  },
  output: {
    model: {
      visitorsA: 1,
      visitorsB: 1,
      probabilityA: 0.5,
      probabilityB: 0.5,
      confidenceLevel: 0.95,
    },
    samplerSeeds: {
      a: "ab-A:2581720956",
      b: "ab-B:1925393290",
    },
    experiments: [
      {
        conversionsA: 1,
        conversionsB: 0,
        analysis: {
          ciHigh: -1,
          ciLow: -1,
          difference: -1,
          pValue: 0.15729920705,
          rateA: 1,
          rateB: 0,
          significant: false,
          standardError: 0.707106781187,
          zScore: -1.41421356237,
        },
      },
      {
        conversionsA: 1,
        conversionsB: 0,
        analysis: {
          ciHigh: -1,
          ciLow: -1,
          difference: -1,
          pValue: 0.15729920705,
          rateA: 1,
          rateB: 0,
          significant: false,
          standardError: 0.707106781187,
          zScore: -1.41421356237,
        },
      },
      {
        conversionsA: 0,
        conversionsB: 0,
        analysis: {
          ciHigh: 0,
          ciLow: 0,
          difference: 0,
          pValue: 1,
          rateA: 0,
          rateB: 0,
          significant: false,
          standardError: 0,
          zScore: 0,
        },
      },
      {
        conversionsA: 0,
        conversionsB: 1,
        analysis: {
          ciHigh: 1,
          ciLow: 1,
          difference: 1,
          pValue: 0.15729920705,
          rateA: 0,
          rateB: 1,
          significant: false,
          standardError: 0.707106781187,
          zScore: 1.41421356237,
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<AbTestExperimentInput, AbTestExperimentOutput>;
export const abTestExperimentTool = createModelDefinition<
  AbTestExperimentInput,
  AbTestExperimentOutput
>({
  id: "random/ab-test-experiment",
  title: "Random A/B Test Experiment Generator",
  description:
    "Generate paired batches of independent synthetic binomial conversion counts under supplied visitor totals/rates and delegate the existing pooled two-proportion z-test plus Wald interval; retain 12-significant-digit summaries, including degenerate endpoint conventions, not exact small-sample inference or real-study advice.",
  inputSchema,
  outputSchema,
  execute: calculateAbTestExperiment,
});
export const runAbTestExperiment = abTestExperimentTool.execute;
export default abTestExperimentTool;
