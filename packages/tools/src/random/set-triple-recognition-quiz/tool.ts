import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculate as checkSet } from "../../game/set-card-all-same-or-all-different-checker/tool.js";
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
  puzzleCount,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type SetTripleRecognitionQuizInput = {
  readonly count: number;
  readonly invalidCount: number;
  readonly seed?: number;
};
export type SetTripleRecognitionQuizOutput = {
  readonly questions: readonly {
    readonly cards: readonly (readonly number[])[];
    readonly validSet: boolean;
    readonly featureFlags: readonly number[];
  }[];
  readonly randomness: GeneratorReplay;
};
const cardSchema = puzzleArray(
  { type: "integer", minimum: 0, maximum: 2 },
  4,
  4,
);
export const inputSchema = puzzleObject(
  {
    count: puzzleCount,
    invalidCount: { type: "integer", minimum: 0, maximum: 64 },
    seed: generatorSeedSchema,
  },
  ["count", "invalidCount"],
);
export const outputSchema = puzzleObject({
  questions: puzzleArray(
    puzzleObject({
      cards: puzzleArray(cardSchema, 3, 3),
      validSet: { type: "boolean" },
      featureFlags: puzzleArray(puzzleInteger, 4, 4),
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
const decode = (index: number): number[] =>
  [27, 9, 3, 1].map((place) => Math.floor(index / place) % 3);
export const calculateSetTripleRecognitionQuiz = (
  input: SetTripleRecognitionQuizInput,
  context?: ToolExecutionContext,
): ToolResult<SetTripleRecognitionQuizOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    if (input.invalidCount > input.count)
      simpleError(
        "invalidCount",
        "Distractors cannot exceed question count.",
        "infeasible_invalid_count",
      );
    const random = createGeneratorRandom(input.seed, context);
    const questions = Array.from({ length: input.count }, (_, index) => {
      const firstIndex = random.integer(0, 80),
        a = decode(firstIndex),
        b = decode((firstIndex + random.integer(1, 80)) % 81),
        c = a.map((v, i) => (6 - v - b[i]) % 3);
      let cards = [a, b, c];
      if (index < input.invalidCount) {
        const mutations: number[][] = [];
        for (let feature = 0; feature < 4; feature += 1)
          for (let delta = 1; delta <= 2; delta += 1) {
            const candidate = c.map((v, i) =>
              i === feature ? (v + delta) % 3 : v,
            );
            if (candidate.join() !== a.join() && candidate.join() !== b.join())
              mutations.push(candidate);
          }
        cards = [a, b, random.pick(mutations)];
      }
      const core = checkSet({ threeCardFeatures: cards });
      if (core.validSet !== index >= input.invalidCount)
        throw new Error("SET construction did not meet the requested key.");
      return {
        cards,
        validSet: core.validSet,
        featureFlags: core.allSameOrAllDifferentFeatureFlags,
      };
    });
    return toolSuccess({
      questions: random.shuffle(questions),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const setTripleRecognitionQuizExample = puzzleFreeze({
  input: { count: 1, invalidCount: 1, seed: 42 },
  output: {
    questions: [
      {
        cards: [
          [1, 2, 1, 0],
          [0, 0, 1, 0],
          [2, 1, 1, 1],
        ],
        validSet: false,
        featureFlags: [1, 1, 1, 0],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  SetTripleRecognitionQuizInput,
  SetTripleRecognitionQuizOutput
>);
const isInput = (input: unknown): input is SetTripleRecognitionQuizInput =>
  matchesModelInput(input, inputSchema);
export const setTripleRecognitionQuizTool = createModelDefinition<
  SetTripleRecognitionQuizInput,
  SetTripleRecognitionQuizOutput
>({
  id: "random/set-triple-recognition-quiz",
  title: "Random SET Triple Recognition Quiz Generator",
  description:
    "Construct distinct four-feature ternary card triples and an exact distractor count with delegated SET validity keys and no artwork.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateSetTripleRecognitionQuiz,
  ),
});
export const runSetTripleRecognitionQuiz = setTripleRecognitionQuizTool.execute;
export default setTripleRecognitionQuizTool;
