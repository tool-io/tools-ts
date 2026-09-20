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
import { runGreatestCommonFactor } from "../../number/greatest-common-factor/tool.js";

export type FractionOrderingCardSetInput = {
  readonly count: number;
  readonly maximumDenominator: number;
  readonly minimumNumerator: number;
  readonly maximumNumerator: number;
  readonly seed?: number;
};
export type FractionOrderingCardSetOutput = {
  readonly cards: readonly {
    readonly numerator: number;
    readonly denominator: number;
    readonly reducedNumerator: number;
    readonly reducedDenominator: number;
  }[];
  readonly order: readonly number[];
  readonly equalAdjacent: readonly boolean[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    count: { type: "integer", minimum: 2, maximum: 16 },
    maximumDenominator: { type: "integer", minimum: 1, maximum: 1000000 },
    minimumNumerator: integer,
    maximumNumerator: integer,
    seed: generatorSeedSchema,
  },
  ["count", "maximumDenominator", "minimumNumerator", "maximumNumerator"],
);
export const outputSchema = object({
  cards: array(
    object({
      numerator: integer,
      denominator: integer,
      reducedNumerator: integer,
      reducedDenominator: integer,
    }),
    16,
    2,
  ),
  order: array(integer, 16, 2),
  equalAdjacent: array(bool, 15, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is FractionOrderingCardSetInput =>
  matchesModelInput(value, inputSchema);
export const calculateFractionOrderingCardSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FractionOrderingCardSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (
      input.minimumNumerator > input.maximumNumerator ||
      !Number.isSafeInteger(input.maximumNumerator - input.minimumNumerator + 1)
    )
      simpleError(
        "maximumNumerator",
        "Numerator range must be ordered and safe.",
        "invalid_range",
      );
    const cards = Array.from({ length: input.count }, () => {
      const denominator = random.integer(1, input.maximumDenominator),
        numerator = random.integer(
          input.minimumNumerator,
          input.maximumNumerator,
        ),
        g = core(
          runGreatestCommonFactor({ first: numerator, second: denominator }),
        ).greatestCommonFactor;
      return {
        numerator,
        denominator,
        reducedNumerator: finite(numerator / g),
        reducedDenominator: denominator / g,
      };
    });
    const compare = (i: number, j: number) => {
      const a = cards[i],
        b = cards[j],
        left = BigInt(a.numerator) * BigInt(b.denominator),
        right = BigInt(b.numerator) * BigInt(a.denominator);
      return left < right ? -1 : left > right ? 1 : 0;
    };
    const order = cards.map((_, i) => i).sort((i, j) => compare(i, j) || i - j),
      equalAdjacent = order.slice(1).map((j, i) => compare(order[i], j) === 0);
    const result = { cards, order, equalAdjacent };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fractionOrderingCardSetExample = {
  input: {
    count: 2,
    maximumDenominator: 5,
    minimumNumerator: -2,
    maximumNumerator: 4,
    seed: 42,
  },
  output: {
    cards: [
      {
        numerator: 1,
        denominator: 4,
        reducedNumerator: 1,
        reducedDenominator: 4,
      },
      {
        numerator: 2,
        denominator: 5,
        reducedNumerator: 2,
        reducedDenominator: 5,
      },
    ],
    order: [0, 1],
    equalAdjacent: [false],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  FractionOrderingCardSetInput,
  FractionOrderingCardSetOutput
>;
export const fractionOrderingCardSetTool = createModelDefinition<
  FractionOrderingCardSetInput,
  FractionOrderingCardSetOutput
>({
  id: "random/fraction-ordering-card-set",
  title: "Random Fraction Ordering Card Set Generator",
  description:
    "Generate rational cards with reduced forms and stable exact BigInt cross-product ordering, retaining ties without floating-point truth labels.",
  inputSchema,
  outputSchema,
  execute: calculateFractionOrderingCardSet,
});
export const runFractionOrderingCardSet = fractionOrderingCardSetTool.execute;
export default fractionOrderingCardSetTool;
