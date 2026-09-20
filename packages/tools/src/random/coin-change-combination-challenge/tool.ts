import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { runDivmod } from "../../arithmetic/divmod/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  textSchema,
  booleanSchema,
  nullableSchema,
  enumSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import { sortedNumbers } from "../m500b-csv-algorithms-sequence.js";

export type CoinChangeCombinationChallengeInput = {
  readonly denominations: readonly number[];
  readonly minimumTarget: number;
  readonly maximumTarget: number;
  readonly count: number;
  readonly control: "any" | "reachable" | "impossible";
  readonly seed?: number;
};
type CoinCase = {
  readonly target: number;
  readonly reachable: boolean;
  readonly combinationCount: string;
  readonly minimumCoins: number | null;
  readonly witness: readonly number[];
  readonly quotientBounds: readonly number[];
};
export type CoinChangeCombinationChallengeOutput = {
  readonly denominations: readonly number[];
  readonly cases: readonly CoinCase[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    denominations: arraySchema(countSchema(32, 1), 8, 1),
    minimumTarget: countSchema(128),
    maximumTarget: countSchema(128),
    count: countSchema(8, 1),
    control: enumSchema(["any", "reachable", "impossible"]),
    seed: generatorSeedSchema,
  },
  ["denominations", "minimumTarget", "maximumTarget", "count", "control"],
);
export const outputSchema = objectSchema({
  denominations: arraySchema(countSchema(32, 1), 8),
  cases: arraySchema(
    objectSchema({
      target: countSchema(128),
      reachable: booleanSchema,
      combinationCount: {
        ...textSchema,
        pattern: "^(?:0|[1-9][0-9]*)(?![\\s\\S])",
      },
      minimumCoins: nullableSchema(countSchema(128)),
      witness: arraySchema(countSchema(32, 1), 128),
      quotientBounds: arraySchema(countSchema(128), 8),
    }),
    8,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is CoinChangeCombinationChallengeInput =>
  matchesModelInput(input, inputSchema);
export const calculateCoinChangeCombinationChallenge = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CoinChangeCombinationChallengeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.denominations, "denominations");
    if (input.minimumTarget > input.maximumTarget)
      return simpleError(
        "maximumTarget",
        "Target bounds must be ordered.",
        "invalid_target_range",
      );
    const denominations = sortedNumbers(input.denominations),
      ways = Array<bigint>(input.maximumTarget + 1).fill(0n),
      minimum = Array<number | null>(input.maximumTarget + 1).fill(null),
      witnesses: number[][] = Array.from(
        { length: input.maximumTarget + 1 },
        () => [],
      );
    ways[0] = 1n;
    minimum[0] = 0;
    for (const coin of denominations)
      for (let amount = coin; amount <= input.maximumTarget; amount += 1) {
        const previous = ways[amount - coin],
          current = ways[amount];
        if (previous === undefined || current === undefined)
          throw new Error("Missing combination recurrence state.");
        ways[amount] = current + previous;
      }
    for (let amount = 1; amount <= input.maximumTarget; amount += 1)
      for (const coin of denominations) {
        if (coin > amount) continue;
        const previous = minimum[amount - coin],
          current = minimum[amount];
        if (previous === undefined || current === undefined)
          throw new Error("Missing minimum-coin recurrence state.");
        if (previous !== null && (current === null || previous + 1 < current)) {
          const witness = witnesses[amount - coin];
          if (!witness) throw new Error("Missing coin witness.");
          minimum[amount] = previous + 1;
          witnesses[amount] = [...witness, coin];
        }
      }
    const candidates = Array.from(
      { length: input.maximumTarget - input.minimumTarget + 1 },
      (_, index) => index + input.minimumTarget,
    ).filter(
      (target) =>
        input.control === "any" ||
        (input.control === "reachable"
          ? minimum[target] !== null
          : minimum[target] === null),
    );
    if (candidates.length === 0)
      return simpleError(
        "control",
        "The requested target interval has no amount with that exact reachability classification.",
        "no_target_in_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, (): CoinCase => {
        const target = random.pick(candidates),
          minimumCoins = minimum[target],
          count = ways[target],
          witness = witnesses[target];
        if (minimumCoins === undefined || count === undefined || !witness)
          throw new Error("Selected coin answer missing.");
        return {
          target,
          reachable: minimumCoins !== null,
          combinationCount: String(count),
          minimumCoins,
          witness: [...witness],
          quotientBounds: denominations.map(
            (divisor) =>
              coreOutput(runDivmod({ dividend: target, divisor })).quotient,
          ),
        };
      });
    return toolSuccess({
      denominations,
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const coinChangeCombinationChallengeExample = {
  input: {
    denominations: [2, 3],
    minimumTarget: 5,
    maximumTarget: 6,
    count: 1,
    control: "any",
    seed: 42,
  },
  output: {
    denominations: [2, 3],
    cases: [
      {
        target: 6,
        reachable: true,
        combinationCount: "2",
        minimumCoins: 2,
        witness: [3, 3],
        quotientBounds: [3, 2],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CoinChangeCombinationChallengeInput,
  CoinChangeCombinationChallengeOutput
>;
export const coinChangeCombinationChallengeTool = createModelDefinition<
  CoinChangeCombinationChallengeInput,
  CoinChangeCombinationChallengeOutput
>({
  id: "random/coin-change-combination-challenge",
  title: "Random Coin Change Combination Challenge Generator",
  description:
    "Sample amounts from an explicitly solved bounded target interval, retaining exact unbounded unordered combination counts, minimum-coin witnesses and reachable or impossible controls; minimum ties retain the first smaller-denomination recurrence.",
  inputSchema,
  outputSchema,
  execute: calculateCoinChangeCombinationChallenge,
});
export const runCoinChangeCombinationChallenge =
  coinChangeCombinationChallengeTool.execute;
export default coinChangeCombinationChallengeTool;
