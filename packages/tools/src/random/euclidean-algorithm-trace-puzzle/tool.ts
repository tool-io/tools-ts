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
import { runDivmod } from "../../arithmetic/divmod/tool.js";
import { runGreatestCommonFactor } from "../../number/greatest-common-factor/tool.js";

export type EuclideanAlgorithmTracePuzzleInput = {
  readonly maximum: number;
  readonly seed?: number;
};
export type EuclideanAlgorithmTracePuzzleOutput = {
  readonly first: number;
  readonly second: number;
  readonly hiddenIndex: number;
  readonly gcd: number;
  readonly trace: readonly {
    readonly dividend: number;
    readonly divisor: number;
    readonly quotient: number;
    readonly remainder: number;
  }[];
  readonly prompt: readonly {
    readonly dividend: number;
    readonly divisor: number;
    readonly quotient: number | null;
    readonly remainder: number | null;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    maximum: { type: "integer", minimum: 2, maximum: 1000000 },
    seed: generatorSeedSchema,
  },
  ["maximum"],
);
export const outputSchema = object({
  first: integer,
  second: integer,
  hiddenIndex: integer,
  gcd: integer,
  trace: array(
    object({
      dividend: integer,
      divisor: integer,
      quotient: integer,
      remainder: integer,
    }),
    32,
    1,
  ),
  prompt: array(
    object({
      dividend: integer,
      divisor: integer,
      quotient: { anyOf: [integer, { type: "null" }] },
      remainder: { anyOf: [integer, { type: "null" }] },
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is EuclideanAlgorithmTracePuzzleInput =>
  matchesModelInput(value, inputSchema);
export const calculateEuclideanAlgorithmTracePuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<EuclideanAlgorithmTracePuzzleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const first = random.integer(1, input.maximum),
      second = random.integer(1, input.maximum),
      trace: {
        dividend: number;
        divisor: number;
        quotient: number;
        remainder: number;
      }[] = [];
    let a = first,
      b = second;
    while (b !== 0) {
      if (trace.length >= 32)
        throw new Error(
          "Euclidean trace exceeded the proven small integer bound",
        );
      const step = core(runDivmod({ dividend: a, divisor: b }));
      trace.push({
        dividend: a,
        divisor: b,
        quotient: step.quotient,
        remainder: finite(step.remainder),
      });
      a = b;
      b = step.remainder;
    }
    const gcd = core(
      runGreatestCommonFactor({ first, second }),
    ).greatestCommonFactor;
    if (gcd !== a) throw new Error("GCD trace mismatch");
    const hiddenIndex = random.integer(0, trace.length - 1),
      prompt = trace.map((step, i) => ({
        ...step,
        quotient: i === hiddenIndex ? null : step.quotient,
        remainder: i === hiddenIndex ? null : step.remainder,
      }));
    const result = { first, second, hiddenIndex, gcd, trace, prompt };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const euclideanAlgorithmTracePuzzleExample = {
  input: { maximum: 30, seed: 42 },
  output: {
    first: 19,
    second: 14,
    hiddenIndex: 3,
    gcd: 1,
    trace: [
      { dividend: 19, divisor: 14, quotient: 1, remainder: 5 },
      { dividend: 14, divisor: 5, quotient: 2, remainder: 4 },
      { dividend: 5, divisor: 4, quotient: 1, remainder: 1 },
      { dividend: 4, divisor: 1, quotient: 4, remainder: 0 },
    ],
    prompt: [
      { dividend: 19, divisor: 14, quotient: 1, remainder: 5 },
      { dividend: 14, divisor: 5, quotient: 2, remainder: 4 },
      { dividend: 5, divisor: 4, quotient: 1, remainder: 1 },
      { dividend: 4, divisor: 1, quotient: null, remainder: null },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  EuclideanAlgorithmTracePuzzleInput,
  EuclideanAlgorithmTracePuzzleOutput
>;
export const euclideanAlgorithmTracePuzzleTool = createModelDefinition<
  EuclideanAlgorithmTracePuzzleInput,
  EuclideanAlgorithmTracePuzzleOutput
>({
  id: "random/euclidean-algorithm-trace-puzzle",
  title: "Random Euclidean Algorithm Trace Puzzle Generator",
  description:
    "Generate positive integer pairs and a complete Euclidean division trace with one hidden quotient/remainder prompt and a verified gcd key.",
  inputSchema,
  outputSchema,
  execute: calculateEuclideanAlgorithmTracePuzzle,
});
export const runEuclideanAlgorithmTracePuzzle =
  euclideanAlgorithmTracePuzzleTool.execute;
export default euclideanAlgorithmTracePuzzleTool;
