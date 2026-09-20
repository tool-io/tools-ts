import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  calculateSyllogismMoodFigureParser,
  type PropositionKind,
  type CategoryTerm,
} from "../../logic/syllogism-mood-figure-parser/tool.js";
import { calculateBarbaraAaa1ValidLookup } from "../../logic/barbara-aaa1-valid-lookup/tool.js";
import { calculateCelarentEae1ValidLookup } from "../../logic/celarent-eae1-valid-lookup/tool.js";
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
  puzzleDistinct,
  puzzleExecutor,
  puzzleFreeze,
  puzzleObject,
  puzzleUnwrap,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type CategoricalAnswerLabel = "valid" | "invalid" | "unknown";
export type CategoricalBankEntry = {
  readonly syllogism: string;
  readonly modernValidity: CategoricalAnswerLabel;
  readonly nonemptyValidity: CategoricalAnswerLabel;
};
export type CategoricalSyllogismQuizInput = {
  readonly answerBank: readonly CategoricalBankEntry[];
  readonly terms: {
    readonly subject: string;
    readonly middle: string;
    readonly predicate: string;
  };
  readonly callerVerified: true;
  readonly provenance: string;
  readonly count: number;
  readonly seed?: number;
};
export type CategoricalSyllogismQuizOutput = {
  readonly cards: readonly {
    readonly syllogism: string;
    readonly majorPremise: string;
    readonly minorPremise: string;
    readonly conclusion: string;
    readonly modernValidity: CategoricalAnswerLabel;
    readonly nonemptyValidity: CategoricalAnswerLabel;
    readonly answerSource: "barbara-core" | "celarent-core" | "supplied-bank";
  }[];
  readonly provenance: string;
  readonly randomness: GeneratorReplay;
};
const label = {
    type: "string",
    enum: ["valid", "invalid", "unknown"],
  } as const,
  text = { type: "string", minLength: 1, maxLength: 64 } as const,
  syllogism = {
    type: "string",
    pattern: "^[AEIO]{3}-[1-4]$(?![\\s\\S])",
    maxLength: 5,
  } as const,
  provenance = { type: "string", minLength: 1, maxLength: 512 } as const;
export const inputSchema = puzzleObject(
  {
    answerBank: puzzleArray(
      puzzleObject({
        syllogism,
        modernValidity: label,
        nonemptyValidity: label,
      }),
      64,
      1,
    ),
    terms: puzzleObject({ subject: text, middle: text, predicate: text }),
    callerVerified: { type: "boolean", const: true },
    provenance,
    count: puzzleCount,
    seed: generatorSeedSchema,
  },
  ["answerBank", "terms", "callerVerified", "provenance", "count"],
);
export const outputSchema = puzzleObject({
  cards: puzzleArray(
    puzzleObject({
      syllogism,
      majorPremise: { type: "string" },
      minorPremise: { type: "string" },
      conclusion: { type: "string" },
      modernValidity: label,
      nonemptyValidity: label,
      answerSource: {
        type: "string",
        enum: ["barbara-core", "celarent-core", "supplied-bank"],
      },
    }),
    64,
    1,
  ),
  provenance,
  randomness: generatorReplaySchema,
});
export const calculateCategoricalSyllogismQuiz = (
  input: CategoricalSyllogismQuizInput,
  context?: ToolExecutionContext,
): ToolResult<CategoricalSyllogismQuizOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    puzzleDistinct(
      input.answerBank.map((v) => v.syllogism),
      "answerBank",
    );
    puzzleDistinct(Object.values(input.terms), "terms");
    for (const entry of input.answerBank)
      if (
        (entry.syllogism === "AAA-1" || entry.syllogism === "EAE-1") &&
        (entry.modernValidity === "invalid" ||
          entry.nonemptyValidity === "invalid")
      )
        simpleError(
          "answerBank",
          "A reviewed key conflicts with the supported named-form core.",
          "reviewed_key_conflict",
        );
    const random = createGeneratorRandom(input.seed, context),
      terms: Readonly<Record<CategoryTerm, string>> = {
        S: input.terms.subject,
        M: input.terms.middle,
        P: input.terms.predicate,
      };
    const proposition = (
      kind: PropositionKind,
      subject: CategoryTerm,
      predicate: CategoryTerm,
    ): string =>
      kind === "A"
        ? `All ${terms[subject]} are ${terms[predicate]}.`
        : kind === "E"
          ? `No ${terms[subject]} are ${terms[predicate]}.`
          : kind === "I"
            ? `Some ${terms[subject]} are ${terms[predicate]}.`
            : `Some ${terms[subject]} are not ${terms[predicate]}.`;
    const cards = Array.from(
      { length: input.count },
      (): CategoricalSyllogismQuizOutput["cards"][number] => {
        const entry = random.pick(input.answerBank),
          parsed = puzzleUnwrap(
            calculateSyllogismMoodFigureParser({ syllogism: entry.syllogism }),
          );
        let answerSource: "barbara-core" | "celarent-core" | "supplied-bank" =
            "supplied-bank",
          modernValidity = entry.modernValidity,
          nonemptyValidity = entry.nonemptyValidity;
        if (entry.syllogism === "AAA-1" || entry.syllogism === "EAE-1") {
          const core =
            entry.syllogism === "AAA-1"
              ? calculateBarbaraAaa1ValidLookup
              : calculateCelarentEae1ValidLookup;
          modernValidity = puzzleUnwrap(core({ nonemptyTerms: [] })).valid
            ? "valid"
            : "invalid";
          nonemptyValidity = puzzleUnwrap(
            core({ nonemptyTerms: ["S", "M", "P"] }),
          ).valid
            ? "valid"
            : "invalid";
          answerSource =
            entry.syllogism === "AAA-1" ? "barbara-core" : "celarent-core";
        }
        return {
          syllogism: entry.syllogism,
          majorPremise: proposition(
            parsed.majorKind,
            parsed.majorSubject,
            parsed.majorPredicate,
          ),
          minorPremise: proposition(
            parsed.minorKind,
            parsed.minorSubject,
            parsed.minorPredicate,
          ),
          conclusion: proposition(parsed.conclusionKind, "S", "P"),
          modernValidity,
          nonemptyValidity,
          answerSource,
        };
      },
    );
    return toolSuccess({
      cards,
      provenance: input.provenance,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const categoricalSyllogismQuizExample = puzzleFreeze({
  input: {
    answerBank: [
      {
        syllogism: "AAA-1",
        modernValidity: "valid",
        nonemptyValidity: "valid",
      },
      {
        syllogism: "EAE-1",
        modernValidity: "valid",
        nonemptyValidity: "valid",
      },
    ],
    terms: { subject: "S-items", middle: "M-items", predicate: "P-items" },
    callerVerified: true,
    provenance: "Caller-reviewed illustrative named forms",
    count: 1,
    seed: 42,
  },
  output: {
    cards: [
      {
        syllogism: "EAE-1",
        majorPremise: "No M-items are P-items.",
        minorPremise: "All S-items are M-items.",
        conclusion: "No S-items are P-items.",
        modernValidity: "valid",
        nonemptyValidity: "valid",
        answerSource: "celarent-core",
      },
    ],
    provenance: "Caller-reviewed illustrative named forms",
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  CategoricalSyllogismQuizInput,
  CategoricalSyllogismQuizOutput
>);
const isInput = (input: unknown): input is CategoricalSyllogismQuizInput =>
  matchesModelInput(input, inputSchema);
export const categoricalSyllogismQuizTool = createModelDefinition<
  CategoricalSyllogismQuizInput,
  CategoricalSyllogismQuizOutput
>({
  id: "random/categorical-syllogism-quiz",
  title: "Random Categorical Syllogism Quiz Generator",
  description:
    "Compose questions from caller-provided terms and reviewed mood/figure answers with explicit existential assumptions, delegating only supported named forms.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateCategoricalSyllogismQuiz,
  ),
});
export const runCategoricalSyllogismQuiz = categoricalSyllogismQuizTool.execute;
export default categoricalSyllogismQuizTool;
