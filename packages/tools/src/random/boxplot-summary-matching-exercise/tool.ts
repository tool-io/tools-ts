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
import { calculateQuartiles } from "../../statistics/quartiles/tool.js";
import { calculateInterquartileRange } from "../../statistics/interquartile-range/tool.js";

export type BoxplotSummaryMatchingExerciseInput = {
  readonly sampleCount: number;
  readonly sampleSize: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly seed?: number;
};
export type BoxplotSummaryMatchingExerciseOutput = {
  readonly samples: readonly (readonly number[])[];
  readonly summaries: readonly {
    readonly sampleIndex: number;
    readonly minimum: number;
    readonly q1: number;
    readonly median: number;
    readonly q3: number;
    readonly maximum: number;
    readonly iqr: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    sampleCount: { type: "integer", minimum: 1, maximum: 8 },
    sampleSize: { type: "integer", minimum: 1, maximum: 16 },
    minimum: integer,
    maximum: integer,
    seed: generatorSeedSchema,
  },
  ["sampleCount", "sampleSize", "minimum", "maximum"],
);
export const outputSchema = object({
  samples: array(array(integer, 16, 1), 8, 1),
  summaries: array(
    object({
      sampleIndex: integer,
      minimum: number,
      q1: number,
      median: number,
      q3: number,
      maximum: number,
      iqr: number,
    }),
    8,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is BoxplotSummaryMatchingExerciseInput =>
  matchesModelInput(value, inputSchema);
export const calculateBoxplotSummaryMatchingExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BoxplotSummaryMatchingExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (
      input.minimum > input.maximum ||
      !Number.isSafeInteger(input.maximum - input.minimum + 1)
    )
      simpleError(
        "maximum",
        "Choose an ordered safe integer range.",
        "invalid_range",
      );
    finite(input.minimum * 2, "minimum");
    finite(input.maximum * 2, "maximum");
    const samples = Array.from({ length: input.sampleCount }, () =>
      Array.from({ length: input.sampleSize }, () =>
        random.integer(input.minimum, input.maximum),
      ),
    );
    const summaries = random.shuffle(
      samples.map((values, sampleIndex) => {
        const q = calculateQuartiles(values),
          iqr = calculateInterquartileRange(values);
        if (q === null || iqr === null)
          return simpleError(
            "maximum",
            "Quartile arithmetic is not finite.",
            "nonfinite_arithmetic",
          );
        return {
          sampleIndex,
          minimum: Math.min(...values),
          q1: finite(q[0]),
          median: finite(q[1]),
          q3: finite(q[2]),
          maximum: Math.max(...values),
          iqr: finite(iqr),
        };
      }),
    );
    const result = { samples, summaries };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const boxplotSummaryMatchingExerciseExample = {
  input: { sampleCount: 1, sampleSize: 3, minimum: 0, maximum: 9, seed: 42 },
  output: {
    samples: [[6, 4, 8]],
    summaries: [
      {
        sampleIndex: 0,
        minimum: 4,
        q1: 5,
        median: 6,
        q3: 7,
        maximum: 8,
        iqr: 2,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BoxplotSummaryMatchingExerciseInput,
  BoxplotSummaryMatchingExerciseOutput
>;
export const boxplotSummaryMatchingExerciseTool = createModelDefinition<
  BoxplotSummaryMatchingExerciseInput,
  BoxplotSummaryMatchingExerciseOutput
>({
  id: "random/boxplot-summary-matching-exercise",
  title: "Random Boxplot Summary Matching Exercise Generator",
  description:
    "Generate integer samples and shuffled exact boxplot summary cards using inclusive median-of-halves quartiles.",
  inputSchema,
  outputSchema,
  execute: calculateBoxplotSummaryMatchingExercise,
});
export const runBoxplotSummaryMatchingExercise =
  boxplotSummaryMatchingExerciseTool.execute;
export default boxplotSummaryMatchingExerciseTool;
