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
  calculatePairedTTest,
  pairedTTestTool,
  type PairedTTestOutput,
} from "../../statistics/paired-t-test/tool.js";
import { drawSyntheticNormal } from "../synthetic-normal-construction.js";
import { experimentSamplesSchema } from "../statistical-experiment-construction.js";

export type PairedTTestTestCaseInput = {
  readonly count: number;
  readonly beforeMean: number;
  readonly beforeStandardDeviation: number;
  readonly offset: number;
  readonly noiseStandardDeviation: number;
  readonly seed?: number;
};
export type PairedTTestTestCaseOutput = {
  readonly model: {
    readonly beforeMean: number;
    readonly beforeStandardDeviation: number;
    readonly offset: number;
    readonly noiseStandardDeviation: number;
  };
  readonly before: readonly number[];
  readonly after: readonly number[];
  readonly analysis: {
    readonly status: "finite" | "undefined-statistic" | "numeric-overflow";
    readonly result: PairedTTestOutput | null;
  };
  readonly randomness: GeneratorReplay;
};
const modelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeMean: { type: "number" },
    beforeStandardDeviation: { type: "number", minimum: 0 },
    offset: { type: "number" },
    noiseStandardDeviation: { type: "number", minimum: 0 },
  },
  required: [
    "beforeMean",
    "beforeStandardDeviation",
    "offset",
    "noiseStandardDeviation",
  ],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...modelSchema.properties,
    count: { type: "integer", minimum: 2, maximum: 1024 },
    seed: generatorSeedSchema,
  },
  required: [...modelSchema.required, "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: modelSchema,
    before: { ...experimentSamplesSchema, minItems: 2, maxItems: 1024 },
    after: { ...experimentSamplesSchema, minItems: 2, maxItems: 1024 },
    analysis: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: {
          type: "string",
          enum: ["finite", "undefined-statistic", "numeric-overflow"],
        },
        result: { anyOf: [pairedTTestTool.outputSchema, { type: "null" }] },
      },
      required: ["status", "result"],
    },
    randomness: generatorReplaySchema,
  },
  required: ["model", "before", "after", "analysis", "randomness"],
} as const;

const isInput = (input: unknown): input is PairedTTestTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculatePairedTTestTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PairedTTestTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      before = Array.from({ length: input.count }, () =>
        drawSyntheticNormal(
          input.beforeMean,
          input.beforeStandardDeviation,
          random,
          "beforeStandardDeviation",
        ),
      );
    const after = before.map((value) => {
      const mean = value + input.offset;
      if (!Number.isFinite(mean))
        simpleError(
          "offset",
          "An after-value center is outside the finite numeric range.",
          "numeric_overflow",
        );
      return drawSyntheticNormal(
        mean,
        input.noiseStandardDeviation,
        random,
        "noiseStandardDeviation",
      );
    });
    const result = calculatePairedTTest({ first: after, second: before });
    let analysis: PairedTTestTestCaseOutput["analysis"];
    if (!result.ok) {
      if (
        !result.error.issues.every(
          (issue) => issue.code === "undefined_statistic",
        )
      )
        throw new Error(
          "Matched finite pairs were unexpectedly rejected by the paired-test core.",
        );
      analysis = { status: "undefined-statistic", result: null };
    } else if (
      Object.values(result.output).some((value) => !Number.isFinite(value))
    )
      analysis = { status: "numeric-overflow", result: null };
    else analysis = { status: "finite", result: result.output };
    return toolSuccess({
      model: {
        beforeMean: input.beforeMean,
        beforeStandardDeviation: input.beforeStandardDeviation,
        offset: input.offset,
        noiseStandardDeviation: input.noiseStandardDeviation,
      },
      before,
      after,
      analysis,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const pairedTTestTestCaseExample = {
  input: {
    count: 3,
    beforeMean: 10,
    beforeStandardDeviation: 1,
    offset: 2,
    noiseStandardDeviation: 1,
    seed: 42,
  },
  output: {
    model: {
      beforeMean: 10,
      beforeStandardDeviation: 1,
      offset: 2,
      noiseStandardDeviation: 1,
    },
    before: [9.043837770615852, 9.72697389511739, 8.158372815216403],
    after: [9.902955699661828, 11.197540101400975, 11.386963488279507],
    analysis: {
      status: "finite",
      result: {
        degreesOfFreedom: 2,
        meanDifference: 1.85275826946,
        sampleSize: 3,
        standardDeviation: 1.23010298391,
        standardError: 0.710200288892,
        tStatistic: 2.60878275951,
      },
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<PairedTTestTestCaseInput, PairedTTestTestCaseOutput>;
export const pairedTTestTestCaseTool = createModelDefinition<
  PairedTTestTestCaseInput,
  PairedTTestTestCaseOutput
>({
  id: "random/paired-t-test-test-case",
  title: "Random Paired T-Test Test Case Generator",
  description:
    "Generate synthetic normal before values and after=before+offset+independent normal noise, then delegate the paired t statistic for after-minus-before; preserve inherited 12-significant-digit results and report undefined/nonfinite statistics explicitly rather than fabricating p-values.",
  inputSchema,
  outputSchema,
  execute: calculatePairedTTestTestCase,
});
export const runPairedTTestTestCase = pairedTTestTestCaseTool.execute;
export default pairedTTestTestCaseTool;
