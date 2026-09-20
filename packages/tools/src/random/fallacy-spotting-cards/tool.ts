import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { calculateAffirmingConsequentFallacyFlag } from "../../logic/affirming-consequent-fallacy-flag/tool.js";
import { calculateDenyingAntecedentFallacyFlag } from "../../logic/denying-antecedent-fallacy-flag/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSampleIndices,
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
export type FallacyCardKind =
  | "affirming-consequent"
  | "denying-antecedent"
  | "modus-ponens"
  | "modus-tollens";
export type FallacySpottingCardsInput = {
  readonly statements: readonly string[];
  readonly provenance: string;
  readonly kinds: readonly FallacyCardKind[];
  readonly count: number;
  readonly seed?: number;
};
export type FallacySpottingCardsOutput = {
  readonly cards: readonly {
    readonly statementP: string;
    readonly statementQ: string;
    readonly premises: readonly string[];
    readonly conclusion: string;
    readonly label: FallacyCardKind;
    readonly formallyValid: boolean;
    readonly counterexample: {
      readonly p: boolean;
      readonly q: boolean;
    } | null;
  }[];
  readonly provenance: string;
  readonly randomness: GeneratorReplay;
};
const kind = {
    type: "string",
    enum: [
      "affirming-consequent",
      "denying-antecedent",
      "modus-ponens",
      "modus-tollens",
    ],
  } as const,
  text = { type: "string", minLength: 1, maxLength: 256 } as const,
  provenance = { type: "string", minLength: 1, maxLength: 512 } as const;
export const inputSchema = puzzleObject(
  {
    statements: puzzleArray(text, 64, 2),
    provenance,
    kinds: puzzleArray(kind, 4, 1),
    count: puzzleCount,
    seed: generatorSeedSchema,
  },
  ["statements", "provenance", "kinds", "count"],
);
export const outputSchema = puzzleObject({
  cards: puzzleArray(
    puzzleObject({
      statementP: text,
      statementQ: text,
      premises: puzzleArray(text, 2, 2),
      conclusion: text,
      label: kind,
      formallyValid: { type: "boolean" },
      counterexample: {
        anyOf: [
          puzzleObject({ p: { type: "boolean" }, q: { type: "boolean" } }),
          { type: "null" },
        ],
      },
    }),
    64,
    1,
  ),
  provenance,
  randomness: generatorReplaySchema,
});
export const calculateFallacySpottingCards = (
  input: FallacySpottingCardsInput,
  context?: ToolExecutionContext,
): ToolResult<FallacySpottingCardsOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    puzzleDistinct(input.statements, "statements");
    puzzleDistinct(input.kinds, "kinds");
    const random = createGeneratorRandom(input.seed, context);
    const cards = Array.from(
      { length: input.count },
      (): FallacySpottingCardsOutput["cards"][number] => {
        const label = random.pick(input.kinds),
          indices = generatorSampleIndices(input.statements.length, 2, random),
          negative =
            label === "denying-antecedent" || label === "modus-tollens",
          fallacy =
            label === "affirming-consequent" || label === "denying-antecedent",
          premise = fallacy ? (negative ? "p" : "q") : negative ? "q" : "p",
          conclusionAtom = fallacy
            ? negative
              ? "q"
              : "p"
            : negative
              ? "p"
              : "q";
        const detected = negative
          ? puzzleUnwrap(
              calculateDenyingAntecedentFallacyFlag({
                antecedent: "p",
                consequent: "q",
                negatedPremise: premise,
                negatedConclusion: conclusionAtom,
              }),
            ).matchesFallacy
          : puzzleUnwrap(
              calculateAffirmingConsequentFallacyFlag({
                antecedent: "p",
                consequent: "q",
                affirmed: premise,
                conclusion: conclusionAtom,
              }),
            ).matchesFallacy;
        if (detected !== fallacy)
          throw new Error("Formal fallacy template disagrees with its core.");
        return {
          statementP: input.statements[indices[0]],
          statementQ: input.statements[indices[1]],
          premises: ["(p -> q)", (negative ? "!" : "") + premise],
          conclusion: (negative ? "!" : "") + conclusionAtom,
          label,
          formallyValid: !detected,
          counterexample: detected ? { p: false, q: true } : null,
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
export const fallacySpottingCardsExample = puzzleFreeze({
  input: {
    statements: ["The lamp is on", "The room is lit"],
    provenance: "Caller-supplied illustrative statements",
    kinds: ["modus-ponens", "affirming-consequent"],
    count: 1,
    seed: 42,
  },
  output: {
    cards: [
      {
        statementP: "The lamp is on",
        statementQ: "The room is lit",
        premises: ["(p -> q)", "q"],
        conclusion: "p",
        label: "affirming-consequent",
        formallyValid: false,
        counterexample: { p: false, q: true },
      },
    ],
    provenance: "Caller-supplied illustrative statements",
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  FallacySpottingCardsInput,
  FallacySpottingCardsOutput
>);
const isInput = (input: unknown): input is FallacySpottingCardsInput =>
  matchesModelInput(input, inputSchema);
export const fallacySpottingCardsTool = createModelDefinition<
  FallacySpottingCardsInput,
  FallacySpottingCardsOutput
>({
  id: "random/fallacy-spotting-cards",
  title: "Random Fallacy Spotting Cards Generator",
  description:
    "Compose supplied statements into supported formal fallacies and valid controls with delegated labels and countervaluations, independent of premise truth.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(isInput, inputSchema, calculateFallacySpottingCards),
});
export const runFallacySpottingCards = fallacySpottingCardsTool.execute;
export default fallacySpottingCardsTool;
