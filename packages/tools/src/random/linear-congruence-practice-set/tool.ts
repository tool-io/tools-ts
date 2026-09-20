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
import { calculateLinearCongruenceSolution } from "../../math/linear-congruence-solution/tool.js";

export type LinearCongruencePracticeSetInput = {
  readonly count: number;
  readonly magnitude: number;
  readonly maximumModulus: number;
  readonly seed?: number;
};
export type LinearCongruencePracticeSetOutput = {
  readonly cards: readonly {
    readonly a: number;
    readonly b: number;
    readonly modulus: number;
    readonly solvable: boolean;
    readonly residue: string;
    readonly period: string;
    readonly multiplicity: string;
    readonly solutions: readonly number[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    count: { type: "integer", minimum: 1, maximum: 16 },
    magnitude: { type: "integer", minimum: 0, maximum: 1000000 },
    maximumModulus: { type: "integer", minimum: 2, maximum: 64 },
    seed: generatorSeedSchema,
  },
  ["count", "magnitude", "maximumModulus"],
);
export const outputSchema = object({
  cards: array(
    object({
      a: integer,
      b: integer,
      modulus: integer,
      solvable: bool,
      residue: { type: "string" },
      period: { type: "string" },
      multiplicity: { type: "string" },
      solutions: array(integer, 64),
    }),
    16,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is LinearCongruencePracticeSetInput =>
  matchesModelInput(value, inputSchema);
export const calculateLinearCongruencePracticeSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<LinearCongruencePracticeSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const cards = Array.from({ length: input.count }, () => {
      const a = random.integer(-input.magnitude, input.magnitude),
        b = random.integer(-input.magnitude, input.magnitude),
        modulus = random.integer(2, input.maximumModulus),
        answer = core(
          calculateLinearCongruenceSolution({
            a: String(a),
            b: String(b),
            modulus: String(modulus),
          }),
        );
      const solutions = answer.solvable
        ? Array.from({ length: Number(answer.multiplicity) }, (_, i) =>
            safe(Number(answer.residue) + i * Number(answer.period)),
          )
        : [];
      return { a, b, modulus, ...answer, solutions };
    });
    const result = { cards };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const linearCongruencePracticeSetExample = {
  input: { count: 1, magnitude: 3, maximumModulus: 8, seed: 42 },
  output: {
    cards: [
      {
        a: 1,
        b: 0,
        modulus: 7,
        solvable: true,
        residue: "0",
        period: "7",
        multiplicity: "1",
        solutions: [0],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  LinearCongruencePracticeSetInput,
  LinearCongruencePracticeSetOutput
>;
export const linearCongruencePracticeSetTool = createModelDefinition<
  LinearCongruencePracticeSetInput,
  LinearCongruencePracticeSetOutput
>({
  id: "random/linear-congruence-practice-set",
  title: "Random Linear Congruence Practice Set Generator",
  description:
    "Generate bounded linear congruences with exact delegated residue/period keys and enumerate every solution class modulo the supplied generated modulus.",
  inputSchema,
  outputSchema,
  execute: calculateLinearCongruencePracticeSet,
});
export const runLinearCongruencePracticeSet =
  linearCongruencePracticeSetTool.execute;
export default linearCongruencePracticeSetTool;
