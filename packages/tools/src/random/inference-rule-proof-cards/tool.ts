import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateModusPonensStepValidator } from "../../logic/modus-ponens-step-validator/tool.js";
import { calculateModusTollensStepValidator } from "../../logic/modus-tollens-step-validator/tool.js";
import { calculateHypotheticalSyllogismValidator } from "../../logic/hypothetical-syllogism-validator/tool.js";
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
export type ProofCardRule =
  "modus-ponens" | "modus-tollens" | "hypothetical-syllogism";
export type InferenceRuleProofCardsInput = {
  readonly rules: readonly ProofCardRule[];
  readonly count: number;
  readonly invalidCount: number;
  readonly seed?: number;
};
export type InferenceRuleProofCardsOutput = {
  readonly cards: readonly {
    readonly rule: ProofCardRule;
    readonly premises: readonly string[];
    readonly conclusion: string;
    readonly matchesRule: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const rule = {
    type: "string",
    enum: ["modus-ponens", "modus-tollens", "hypothetical-syllogism"],
  } as const,
  text = { type: "string", maxLength: 100 } as const;
export const inputSchema = puzzleObject(
  {
    rules: puzzleArray(rule, 3, 1),
    count: puzzleCount,
    invalidCount: { type: "integer", minimum: 0, maximum: 64 },
    seed: generatorSeedSchema,
  },
  ["rules", "count", "invalidCount"],
);
export const outputSchema = puzzleObject({
  cards: puzzleArray(
    puzzleObject({
      rule,
      premises: puzzleArray(text, 2, 2),
      conclusion: text,
      matchesRule: { type: "boolean" },
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
export const calculateInferenceRuleProofCards = (
  input: InferenceRuleProofCardsInput,
  context?: ToolExecutionContext,
): ToolResult<InferenceRuleProofCardsOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    puzzleDistinct(input.rules, "rules");
    if (input.invalidCount > input.count)
      simpleError(
        "invalidCount",
        "Invalid cards cannot exceed card count.",
        "infeasible_invalid_count",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cards = Array.from({ length: input.count }, (_, i) => {
      const rule = random.pick(input.rules),
        p = `p${i + 1}`,
        q = `q${i + 1}`,
        r = `r${i + 1}`,
        x = `x${i + 1}`,
        valid = i >= input.invalidCount;
      if (rule === "modus-ponens") {
        const conclusion = valid ? q : x,
          key = puzzleUnwrap(
            calculateModusPonensStepValidator({
              antecedent: p,
              consequent: q,
              affirmed: p,
              conclusion,
            }),
          );
        return {
          rule,
          premises: [`(${p} -> ${q})`, p],
          conclusion,
          matchesRule: key.matchesRule,
        };
      }
      if (rule === "modus-tollens") {
        const conclusionAtom = valid ? p : x,
          key = puzzleUnwrap(
            calculateModusTollensStepValidator({
              antecedent: p,
              consequent: q,
              negatedPremise: q,
              negatedConclusion: conclusionAtom,
            }),
          );
        return {
          rule,
          premises: [`(${p} -> ${q})`, `!${q}`],
          conclusion: `!${conclusionAtom}`,
          matchesRule: key.matchesRule,
        };
      }
      const end = valid ? r : x,
        key = puzzleUnwrap(
          calculateHypotheticalSyllogismValidator({
            firstAntecedent: p,
            firstConsequent: q,
            secondAntecedent: q,
            secondConsequent: r,
            conclusionAntecedent: p,
            conclusionConsequent: end,
          }),
        );
      return {
        rule,
        premises: [`(${p} -> ${q})`, `(${q} -> ${r})`],
        conclusion: `(${p} -> ${end})`,
        matchesRule: key.matchesRule,
      };
    });
    return toolSuccess({
      cards: random.shuffle(cards),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const inferenceRuleProofCardsExample = puzzleFreeze({
  input: {
    rules: ["modus-ponens", "modus-tollens", "hypothetical-syllogism"],
    count: 2,
    invalidCount: 1,
    seed: 42,
  },
  output: {
    cards: [
      {
        rule: "modus-tollens",
        premises: ["(p1 -> q1)", "!q1"],
        conclusion: "!x1",
        matchesRule: false,
      },
      {
        rule: "modus-tollens",
        premises: ["(p2 -> q2)", "!q2"],
        conclusion: "!p2",
        matchesRule: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  InferenceRuleProofCardsInput,
  InferenceRuleProofCardsOutput
>);
const isInput = (input: unknown): input is InferenceRuleProofCardsInput =>
  matchesModelInput(input, inputSchema);
export const inferenceRuleProofCardsTool = createModelDefinition<
  InferenceRuleProofCardsInput,
  InferenceRuleProofCardsOutput
>({
  id: "random/inference-rule-proof-cards",
  title: "Random Inference Rule Proof Cards Generator",
  description:
    "Compose formal modus ponens, modus tollens, and hypothetical syllogism cards with fresh illustrative atoms and controlled invalid conclusions, delegating rule keys.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateInferenceRuleProofCards,
  ),
});
export const runInferenceRuleProofCards = inferenceRuleProofCardsTool.execute;
export default inferenceRuleProofCardsTool;
