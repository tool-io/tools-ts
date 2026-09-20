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
import { calculate as roundSignificant } from "../../arithmetic/round-significant-figures/tool.js";

export type SignificantFigureRoundingQuizInput = {
  readonly integerDigits: number;
  readonly fractionalDigits: number;
  readonly significantDigits: number;
  readonly count: number;
  readonly seed?: number;
};
export type SignificantFigureRoundingQuizOutput = {
  readonly cards: readonly {
    readonly spelling: string;
    readonly significantDigits: number;
    readonly roundedValue: number;
    readonly roundedText: string;
  }[];
  readonly convention: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    integerDigits: { type: "integer", minimum: 1, maximum: 12 },
    fractionalDigits: { type: "integer", minimum: 0, maximum: 11 },
    significantDigits: { type: "integer", minimum: 1, maximum: 15 },
    count: { type: "integer", minimum: 1, maximum: 16 },
    seed: generatorSeedSchema,
  },
  ["integerDigits", "fractionalDigits", "significantDigits", "count"],
);
export const outputSchema = object({
  cards: array(
    object({
      spelling: { type: "string", minLength: 1, maxLength: 13 },
      significantDigits: integer,
      roundedValue: number,
      roundedText: { type: "string" },
    }),
    16,
    1,
  ),
  convention: { type: "string" },
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SignificantFigureRoundingQuizInput =>
  matchesModelInput(value, inputSchema);
export const calculateSignificantFigureRoundingQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SignificantFigureRoundingQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.integerDigits + input.fractionalDigits > 12)
      simpleError(
        "fractionalDigits",
        "At most twelve spelling digits are supported.",
        "resource_limit_exceeded",
      );
    const cards = Array.from({ length: input.count }, () => {
      const digits = Array.from(
        { length: input.integerDigits + input.fractionalDigits },
        (_, i) => random.integer(i === 0 ? 1 : 0, 9),
      );
      const spelling =
        digits.slice(0, input.integerDigits).join("") +
        (input.fractionalDigits
          ? "." + digits.slice(input.integerDigits).join("")
          : "");
      const rounded = roundSignificant({
        actualFiniteNumber: Number(spelling),
        actualSignificantDigits: input.significantDigits,
      }).result;
      if (
        typeof rounded.roundedValue !== "number" ||
        typeof rounded.roundedSignificantText !== "string"
      )
        throw new Error("Rounding core changed its result shape");
      return {
        spelling,
        significantDigits: input.significantDigits,
        roundedValue: finite(rounded.roundedValue),
        roundedText: rounded.roundedSignificantText,
      };
    });
    const result = {
      cards,
      convention:
        "binary64 toPrecision; original spelling preserves trailing fractional zeros",
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const significantFigureRoundingQuizExample = {
  input: {
    integerDigits: 3,
    fractionalDigits: 1,
    significantDigits: 2,
    count: 1,
    seed: 42,
  },
  output: {
    cards: [
      {
        spelling: "648.6",
        significantDigits: 2,
        roundedValue: 650,
        roundedText: "6.5e+2",
      },
    ],
    convention:
      "binary64 toPrecision; original spelling preserves trailing fractional zeros",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SignificantFigureRoundingQuizInput,
  SignificantFigureRoundingQuizOutput
>;
export const significantFigureRoundingQuizTool = createModelDefinition<
  SignificantFigureRoundingQuizInput,
  SignificantFigureRoundingQuizOutput
>({
  id: "random/significant-figure-rounding-quiz",
  title: "Random Significant Figure Rounding Quiz Generator",
  description:
    "Construct decimal spellings and delegate binary64 significant-digit rounding, retaining original trailing zeros and the core's significant text convention.",
  inputSchema,
  outputSchema,
  execute: calculateSignificantFigureRoundingQuiz,
});
export const runSignificantFigureRoundingQuiz =
  significantFigureRoundingQuizTool.execute;
export default significantFigureRoundingQuizTool;
