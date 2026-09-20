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
import { calculateConvergentsFromContinuedFraction } from "../../math/convergents-from-continued-fraction/tool.js";

export type ContinuedFractionConvergentQuizInput = {
  readonly minimumFirst: number;
  readonly maximumFirst: number;
  readonly maximumTail: number;
  readonly length: number;
  readonly seed?: number;
};
export type ContinuedFractionConvergentQuizOutput = {
  readonly coefficients: readonly number[];
  readonly convergents: readonly {
    readonly numerator: string;
    readonly denominator: string;
  }[];
  readonly hiddenIndex: number;
  readonly prompt: readonly ({
    readonly numerator: string;
    readonly denominator: string;
  } | null)[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    minimumFirst: integer,
    maximumFirst: integer,
    maximumTail: { type: "integer", minimum: 1, maximum: 32 },
    length: { type: "integer", minimum: 1, maximum: 16 },
    seed: generatorSeedSchema,
  },
  ["minimumFirst", "maximumFirst", "maximumTail", "length"],
);
export const outputSchema = object({
  coefficients: array(integer, 16, 1),
  convergents: array(
    object({ numerator: { type: "string" }, denominator: { type: "string" } }),
    16,
    1,
  ),
  hiddenIndex: integer,
  prompt: array(
    {
      anyOf: [
        object({
          numerator: { type: "string" },
          denominator: { type: "string" },
        }),
        { type: "null" },
      ],
    },
    16,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is ContinuedFractionConvergentQuizInput =>
  matchesModelInput(value, inputSchema);
export const calculateContinuedFractionConvergentQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ContinuedFractionConvergentQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (
      input.minimumFirst > input.maximumFirst ||
      !Number.isSafeInteger(input.maximumFirst - input.minimumFirst + 1)
    )
      simpleError(
        "maximumFirst",
        "First coefficient range must be ordered and safe.",
        "invalid_range",
      );
    const coefficients = Array.from({ length: input.length }, (_, i) =>
        i === 0
          ? random.integer(input.minimumFirst, input.maximumFirst)
          : random.integer(1, input.maximumTail),
      ),
      convergents = core(
        calculateConvergentsFromContinuedFraction({ coefficients }),
      ).convergents,
      hiddenIndex = random.integer(0, input.length - 1),
      prompt = convergents.map((c, i) => (i === hiddenIndex ? null : { ...c }));
    const result = { coefficients, convergents, hiddenIndex, prompt };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const continuedFractionConvergentQuizExample = {
  input: {
    minimumFirst: 1,
    maximumFirst: 3,
    maximumTail: 4,
    length: 3,
    seed: 42,
  },
  output: {
    coefficients: [2, 2, 4],
    convergents: [
      { numerator: "2", denominator: "1" },
      { numerator: "5", denominator: "2" },
      { numerator: "22", denominator: "9" },
    ],
    hiddenIndex: 2,
    prompt: [
      { numerator: "2", denominator: "1" },
      { numerator: "5", denominator: "2" },
      null,
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ContinuedFractionConvergentQuizInput,
  ContinuedFractionConvergentQuizOutput
>;
export const continuedFractionConvergentQuizTool = createModelDefinition<
  ContinuedFractionConvergentQuizInput,
  ContinuedFractionConvergentQuizOutput
>({
  id: "random/continued-fraction-convergent-quiz",
  title: "Random Continued Fraction Convergent Quiz Generator",
  description:
    "Construct finite simple continued fractions with signed integral first coefficients and positive tails, retaining exact rational convergents and one hidden prompt.",
  inputSchema,
  outputSchema,
  execute: calculateContinuedFractionConvergentQuiz,
});
export const runContinuedFractionConvergentQuiz =
  continuedFractionConvergentQuizTool.execute;
export default continuedFractionConvergentQuizTool;
