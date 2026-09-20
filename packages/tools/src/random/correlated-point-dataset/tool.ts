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
  normalSamplesSchema,
  drawStandardNormal,
  generatedPearson,
} from "../synthetic-normal-construction.js";

export type CorrelatedPointDatasetInput = {
  readonly count: number;
  readonly meanX: number;
  readonly meanY: number;
  readonly standardDeviationX: number;
  readonly standardDeviationY: number;
  readonly targetCorrelation: number;
  readonly seed?: number;
};
export type CorrelatedPointDatasetOutput = {
  readonly x: readonly number[];
  readonly y: readonly number[];
  readonly targetCorrelation: number;
  readonly diagnostics: { readonly sampleCorrelation: number | null };
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 2, maximum: 2048 },
    meanX: { type: "number" },
    meanY: { type: "number" },
    standardDeviationX: { type: "number", minimum: 0 },
    standardDeviationY: { type: "number", minimum: 0 },
    targetCorrelation: { type: "number", minimum: -1, maximum: 1 },
    seed: generatorSeedSchema,
  },
  required: [
    "count",
    "meanX",
    "meanY",
    "standardDeviationX",
    "standardDeviationY",
    "targetCorrelation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { ...normalSamplesSchema, minItems: 2 },
    y: { ...normalSamplesSchema, minItems: 2 },
    targetCorrelation: { type: "number", minimum: -1, maximum: 1 },
    diagnostics: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleCorrelation: {
          anyOf: [
            { type: "number", minimum: -1, maximum: 1 },
            { type: "null" },
          ],
        },
      },
      required: ["sampleCorrelation"],
    },
    randomness: generatorReplaySchema,
  },
  required: ["x", "y", "targetCorrelation", "diagnostics", "randomness"],
} as const;

const isInput = (input: unknown): input is CorrelatedPointDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateCorrelatedPointDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CorrelatedPointDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      x: number[] = [],
      y: number[] = [];
    const independentFactor =
      Math.sqrt(1 - input.targetCorrelation) *
      Math.sqrt(1 + input.targetCorrelation);
    for (let i = 0; i < input.count; i += 1) {
      const first = drawStandardNormal(random),
        second = drawStandardNormal(random);
      const firstValue = input.meanX + input.standardDeviationX * first;
      const secondValue =
        input.meanY +
        input.standardDeviationY *
          (input.targetCorrelation * first + independentFactor * second);
      if (!Number.isFinite(firstValue))
        simpleError(
          "standardDeviationX",
          "A generated X coordinate is not finite.",
          "numeric_overflow",
        );
      if (!Number.isFinite(secondValue))
        simpleError(
          "standardDeviationY",
          "A generated Y coordinate is not finite.",
          "numeric_overflow",
        );
      x.push(firstValue === 0 ? 0 : firstValue);
      y.push(secondValue === 0 ? 0 : secondValue);
    }
    return toolSuccess({
      x,
      y,
      targetCorrelation: input.targetCorrelation,
      diagnostics: { sampleCorrelation: generatedPearson(x, y) },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const correlatedPointDatasetExample = {
  input: {
    count: 6,
    meanX: 10,
    meanY: -5,
    standardDeviationX: 2,
    standardDeviationY: 1,
    targetCorrelation: 0.7,
    seed: 42,
  },
  output: {
    x: [
      8.087675541231702, 6.3167456304328065, 8.94113241256717, 9.46296454674551,
      8.668001703485878, 11.130573722141582,
    ],
    y: [
      -5.864293199283204, -7.103891794861108, -4.493214419635946,
      -6.474700282182268, -7.807928869718577, -3.8877287338231175,
    ],
    targetCorrelation: 0.7,
    diagnostics: {
      sampleCorrelation: 0.643258763230912,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  CorrelatedPointDatasetInput,
  CorrelatedPointDatasetOutput
>;
export const correlatedPointDatasetTool = createModelDefinition<
  CorrelatedPointDatasetInput,
  CorrelatedPointDatasetOutput
>({
  id: "random/correlated-point-dataset",
  title: "Random Correlated Point Dataset Generator",
  description:
    "Generate bivariate Box–Muller coordinates under a supplied population correlation, preserving the normal core's epsilon clipping and the normalized Pearson core's 15-significant-digit diagnostic; constant coordinates produce null and sample correlation is not forced to the target.",
  inputSchema,
  outputSchema,
  execute: calculateCorrelatedPointDataset,
});
export const runCorrelatedPointDataset = correlatedPointDatasetTool.execute;
export default correlatedPointDatasetTool;
