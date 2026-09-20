import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateLevenshtein } from "../../distance/levenshtein/tool.js";
import { calculateShortestUnweightedPath } from "../../graph/shortest-unweighted-path/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  puzzleArray,
  puzzleDistinct,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleValidate,
  puzzleWord,
} from "../m250-puzzles-logic-support.js";
export type WordLadderChallengeInput = {
  readonly words: readonly string[];
  readonly minimumSteps: number;
  readonly provenance: string;
  readonly seed?: number;
};
export type WordLadderChallengeOutput = {
  readonly puzzle: { readonly start: string; readonly target: string };
  readonly answer: {
    readonly shortestPath: readonly string[];
    readonly steps: number;
  };
  readonly edges: readonly (readonly string[])[];
  readonly eligiblePairCount: number;
  readonly provenance: string;
  readonly randomness: GeneratorReplay;
};
const word = { ...puzzleWord, maxLength: 16 },
  provenance = { type: "string", minLength: 1, maxLength: 512 } as const;
export const inputSchema = puzzleObject(
  {
    words: puzzleArray(word, 64, 2),
    minimumSteps: { type: "integer", minimum: 1, maximum: 63 },
    provenance,
    seed: generatorSeedSchema,
  },
  ["words", "minimumSteps", "provenance"],
);
export const outputSchema = puzzleObject({
  puzzle: puzzleObject({ start: word, target: word }),
  answer: puzzleObject({
    shortestPath: puzzleArray(word, 64, 2),
    steps: puzzleInteger,
  }),
  edges: puzzleArray(puzzleArray(word, 2, 2), 2016),
  eligiblePairCount: puzzleInteger,
  provenance,
  randomness: generatorReplaySchema,
});
export const calculateWordLadderChallenge = (
  input: WordLadderChallengeInput,
  context?: ToolExecutionContext,
): ToolResult<WordLadderChallengeOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    puzzleDistinct(input.words, "words");
    if (input.words.some((w) => w.length !== input.words[0].length))
      simpleError(
        "words",
        "Word ladders require equal-length words.",
        "word_length_mismatch",
      );
    const words = [...input.words].sort(),
      graph: Record<string, string[]> = Object.fromEntries(
        words.map((w) => [w, []]),
      ),
      edges: string[][] = [];
    for (let i = 0; i < words.length; i += 1)
      for (let j = i + 1; j < words.length; j += 1)
        if (calculateLevenshtein({ a: words[i], b: words[j] }).distance === 1) {
          graph[words[i]].push(words[j]);
          graph[words[j]].push(words[i]);
          edges.push([words[i], words[j]]);
        }
    const pairs: { start: string; target: string }[] = [];
    // Only reachability/distances are inspected here; the selected shortest answer is delegated below.
    for (const start of words) {
      const distances = new Map<string, number>([[start, 0]]),
        queue = [start];
      for (let head = 0; head < queue.length; head += 1) {
        const current = queue[head],
          distance = distances.get(current);
        if (distance === undefined)
          throw new Error("BFS queue lost a distance.");
        for (const next of graph[current])
          if (!distances.has(next)) {
            distances.set(next, distance + 1);
            queue.push(next);
          }
      }
      for (const target of words)
        if (
          target > start &&
          (distances.get(target) ?? -1) >= input.minimumSteps
        )
          pairs.push({ start, target });
    }
    if (!pairs.length)
      simpleError(
        "minimumSteps",
        "No reachable endpoint pair meets the requested minimum distance.",
        "no_eligible_ladder",
      );
    const random = createGeneratorRandom(input.seed, context),
      puzzle = random.pick(pairs),
      answer = calculateShortestUnweightedPath({
        graph,
        source: puzzle.start,
        target: puzzle.target,
        directed: false,
      });
    if (!answer.found)
      throw new Error("Eligible word ladder became unreachable.");
    return toolSuccess({
      puzzle,
      answer: { shortestPath: answer.path, steps: answer.distance },
      edges,
      eligiblePairCount: pairs.length,
      provenance: input.provenance,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const wordLadderChallengeExample = puzzleFreeze({
  input: {
    words: ["cat", "cot", "cog", "dog"],
    minimumSteps: 2,
    provenance: "Caller-supplied illustrative word bank",
    seed: 42,
  },
  output: {
    puzzle: { start: "cat", target: "dog" },
    answer: { shortestPath: ["cat", "cot", "cog", "dog"], steps: 3 },
    edges: [
      ["cat", "cot"],
      ["cog", "cot"],
      ["cog", "dog"],
    ],
    eligiblePairCount: 3,
    provenance: "Caller-supplied illustrative word bank",
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  WordLadderChallengeInput,
  WordLadderChallengeOutput
>);
const isInput = (input: unknown): input is WordLadderChallengeInput =>
  matchesModelInput(input, inputSchema);
export const wordLadderChallengeTool = createModelDefinition<
  WordLadderChallengeInput,
  WordLadderChallengeOutput
>({
  id: "random/word-ladder-challenge",
  title: "Random Word Ladder Challenge Generator",
  description:
    "Build one-letter adjacency from a supplied lexicon, draw reachable endpoints, and return a delegated shortest ladder while allowing alternate solutions.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(isInput, inputSchema, calculateWordLadderChallenge),
});
export const runWordLadderChallenge = wordLadderChallengeTool.execute;
export default wordLadderChallengeTool;
