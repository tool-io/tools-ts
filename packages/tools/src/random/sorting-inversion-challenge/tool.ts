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
import {
  arraySchema,
  objectSchema,
  countSchema,
} from "../m500b-csv-algorithms-schemas.js";
import { sortedNumbers } from "../m500b-csv-algorithms-sequence.js";

export type SortingInversionChallengeInput = {
  readonly size: number;
  readonly minimumInversions: number;
  readonly maximumInversions: number;
  readonly seed?: number;
};
export type SortingInversionChallengeOutput = {
  readonly permutation: readonly number[];
  readonly lehmerDigits: readonly number[];
  readonly inversionCount: number;
  readonly sortedAnswer: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    size: countSchema(32, 2),
    minimumInversions: countSchema(496),
    maximumInversions: countSchema(496),
    seed: generatorSeedSchema,
  },
  ["size", "minimumInversions", "maximumInversions"],
);
export const outputSchema = objectSchema({
  permutation: arraySchema(countSchema(32, 1), 32),
  lehmerDigits: arraySchema(countSchema(31), 32),
  inversionCount: countSchema(496),
  sortedAnswer: arraySchema(countSchema(32, 1), 32),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is SortingInversionChallengeInput =>
  matchesModelInput(input, inputSchema);
export const calculateSortingInversionChallenge = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SortingInversionChallengeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      input.minimumInversions > input.maximumInversions ||
      input.maximumInversions > (input.size * (input.size - 1)) / 2
    )
      return simpleError(
        "maximumInversions",
        "Inversion bounds must be ordered and feasible for this size.",
        "infeasible_inversions",
      );
    const random = createGeneratorRandom(input.seed, context),
      inversionCount = random.integer(
        input.minimumInversions,
        input.maximumInversions,
      ),
      available = Array.from({ length: input.size }, (_, index) => index + 1),
      permutation: number[] = [],
      lehmerDigits: number[] = [];
    let remaining = inversionCount;
    while (available.length > 0) {
      const tail = available.length - 1,
        tailMaximum = (tail * (tail - 1)) / 2,
        digit = random.integer(
          Math.max(0, remaining - tailMaximum),
          Math.min(tail, remaining),
        );
      const value = available.splice(digit, 1)[0];
      if (value === undefined)
        throw new Error("Invalid constructed Lehmer digit.");
      permutation.push(value);
      lehmerDigits.push(digit);
      remaining -= digit;
    }
    let actual = 0;
    permutation.forEach((value, index) => {
      for (const later of permutation.slice(index + 1))
        if (value > later) actual += 1;
    });
    if (remaining !== 0 || actual !== inversionCount)
      throw new Error("Inversion construction did not conserve its target.");
    return toolSuccess({
      permutation,
      lehmerDigits,
      inversionCount,
      sortedAnswer: sortedNumbers(permutation),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const sortingInversionChallengeExample = {
  input: { size: 4, minimumInversions: 3, maximumInversions: 3, seed: 42 },
  output: {
    permutation: [2, 4, 1, 3],
    lehmerDigits: [1, 2, 0, 0],
    inversionCount: 3,
    sortedAnswer: [1, 2, 3, 4],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SortingInversionChallengeInput,
  SortingInversionChallengeOutput
>;
export const sortingInversionChallengeTool = createModelDefinition<
  SortingInversionChallengeInput,
  SortingInversionChallengeOutput
>({
  id: "random/sorting-inversion-challenge",
  title: "Random Sorting Inversion Challenge Generator",
  description:
    "Construct a permutation with an exact sampled feasible inversion count using sequential constrained Lehmer digits and retain its sorted answer; sampling is not uniform over permutations.",
  inputSchema,
  outputSchema,
  execute: calculateSortingInversionChallenge,
});
export const runSortingInversionChallenge =
  sortingInversionChallengeTool.execute;
export default sortingInversionChallengeTool;
