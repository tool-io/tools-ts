import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { calculateExistentialImportInvalidityFlag } from "../../logic/existential-import-invalidity-flag/tool.js";
import { runIntersection } from "../../set/intersection/tool.js";
import { runDifference } from "../../set/difference/tool.js";
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
  puzzleBoolean,
  puzzleCount,
  puzzleDistinct,
  puzzleExecutor,
  puzzleFreeze,
  puzzleObject,
  puzzleUnwrap,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type ExistentialCounterexampleTemplate = "AAI-1" | "EAO-1";
export type ExistentialImportCounterexampleCardsInput = {
  readonly templates: readonly ExistentialCounterexampleTemplate[];
  readonly universeSize: number;
  readonly count: number;
  readonly seed?: number;
};
export type ExistentialImportCounterexampleCardsOutput = {
  readonly interpretation: "modern-vacuous-universals-nonempty-universe";
  readonly cards: readonly {
    readonly syllogism: ExistentialCounterexampleTemplate;
    readonly universe: readonly string[];
    readonly sets: {
      readonly S: readonly string[];
      readonly M: readonly string[];
      readonly P: readonly string[];
    };
    readonly majorPremiseTrue: boolean;
    readonly minorPremiseTrue: boolean;
    readonly conclusionTrue: boolean;
    readonly isCounterexample: boolean;
    readonly existentialImportRequired: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const template = { type: "string", enum: ["AAI-1", "EAO-1"] } as const,
  set = puzzleArray({ type: "string" }, 32);
export const inputSchema = puzzleObject(
  {
    templates: puzzleArray(template, 2, 1),
    universeSize: { type: "integer", minimum: 1, maximum: 32 },
    count: puzzleCount,
    seed: generatorSeedSchema,
  },
  ["templates", "universeSize", "count"],
);
export const outputSchema = puzzleObject({
  interpretation: {
    type: "string",
    const: "modern-vacuous-universals-nonempty-universe",
  },
  cards: puzzleArray(
    puzzleObject({
      syllogism: template,
      universe: set,
      sets: puzzleObject({ S: set, M: set, P: set }),
      majorPremiseTrue: puzzleBoolean,
      minorPremiseTrue: puzzleBoolean,
      conclusionTrue: puzzleBoolean,
      isCounterexample: puzzleBoolean,
      existentialImportRequired: puzzleBoolean,
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
export const calculateExistentialImportCounterexampleCards = (
  input: ExistentialImportCounterexampleCardsInput,
  context?: ToolExecutionContext,
): ToolResult<ExistentialImportCounterexampleCardsOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    puzzleDistinct(input.templates, "templates");
    const random = createGeneratorRandom(input.seed, context),
      universe = Array.from(
        { length: input.universeSize },
        (_, i) => `u${i + 1}`,
      );
    const cards = Array.from({ length: input.count }, () => {
      const syllogism = random.pick(input.templates),
        S: string[] = [],
        M: string[] = [],
        P: string[] = [];
      for (const element of universe) {
        const inM = random.integer(0, 1) === 1,
          inP = inM ? syllogism === "AAI-1" : random.integer(0, 1) === 1;
        if (inM) M.push(element);
        if (inP) P.push(element);
      }
      const difference = (
        first: readonly string[],
        second: readonly string[],
      ): readonly string[] =>
        puzzleUnwrap(runDifference({ first, second })).values;
      const intersection = (
        first: readonly string[],
        second: readonly string[],
      ): readonly string[] =>
        puzzleUnwrap(runIntersection({ first, second })).values;
      const majorPremiseTrue =
          syllogism === "AAI-1"
            ? difference(M, P).length === 0
            : intersection(M, P).length === 0,
        minorPremiseTrue = difference(S, M).length === 0,
        conclusionTrue =
          syllogism === "AAI-1"
            ? intersection(S, P).length > 0
            : difference(S, P).length > 0;
      const core = puzzleUnwrap(
        calculateExistentialImportInvalidityFlag({
          majorKind: syllogism === "AAI-1" ? "A" : "E",
          minorKind: "A",
          conclusionKind: syllogism === "AAI-1" ? "I" : "O",
          figure: 1,
        }),
      );
      const isCounterexample =
        majorPremiseTrue && minorPremiseTrue && !conclusionTrue;
      if (!isCounterexample || !core.existentialImportRequired)
        throw new Error(
          "Constructed finite model failed its counterexample obligations.",
        );
      return {
        syllogism,
        universe: [...universe],
        sets: { S, M, P },
        majorPremiseTrue,
        minorPremiseTrue,
        conclusionTrue,
        isCounterexample,
        existentialImportRequired: core.existentialImportRequired,
      };
    });
    return toolSuccess({
      interpretation: "modern-vacuous-universals-nonempty-universe",
      cards,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const existentialImportCounterexampleCardsExample = puzzleFreeze({
  input: { templates: ["AAI-1", "EAO-1"], universeSize: 3, count: 1, seed: 42 },
  output: {
    interpretation: "modern-vacuous-universals-nonempty-universe",
    cards: [
      {
        syllogism: "EAO-1",
        universe: ["u1", "u2", "u3"],
        sets: { S: [], M: ["u2"], P: ["u1", "u3"] },
        majorPremiseTrue: true,
        minorPremiseTrue: true,
        conclusionTrue: false,
        isCounterexample: true,
        existentialImportRequired: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  ExistentialImportCounterexampleCardsInput,
  ExistentialImportCounterexampleCardsOutput
>);
const isInput = (
  input: unknown,
): input is ExistentialImportCounterexampleCardsInput =>
  matchesModelInput(input, inputSchema);
export const existentialImportCounterexampleCardsTool = createModelDefinition<
  ExistentialImportCounterexampleCardsInput,
  ExistentialImportCounterexampleCardsOutput
>({
  id: "random/existential-import-counterexample-cards",
  title: "Random Existential Import Counterexample Cards Generator",
  description:
    "Construct and verify explicit finite countermodels for AAI-1 and EAO-1 using empty subjects under modern vacuous-universal semantics.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateExistentialImportCounterexampleCards,
  ),
});
export const runExistentialImportCounterexampleCards =
  existentialImportCounterexampleCardsTool.execute;
export default existentialImportCounterexampleCardsTool;
