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

export type BalanceScaleEquationPuzzleInput = {
  readonly symbols: readonly string[];
  readonly maximumWeight: number;
  readonly equationCount: number;
  readonly seed?: number;
};
export type BalanceScaleEquationPuzzleOutput = {
  readonly solution: readonly {
    readonly symbol: string;
    readonly weight: number;
  }[];
  readonly equations: readonly {
    readonly coefficients: readonly number[];
    readonly total: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    symbols: array(label, 8, 1),
    maximumWeight: { type: "integer", minimum: 0, maximum: 1000000 },
    equationCount: { type: "integer", minimum: 1, maximum: 16 },
    seed: generatorSeedSchema,
  },
  ["symbols", "maximumWeight", "equationCount"],
);
export const outputSchema = object({
  solution: array(object({ symbol: label, weight: integer }), 8, 1),
  equations: array(
    object({ coefficients: array(integer, 8, 1), total: integer }),
    16,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is BalanceScaleEquationPuzzleInput =>
  matchesModelInput(value, inputSchema);
export const calculateBalanceScaleEquationPuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BalanceScaleEquationPuzzleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    distinct(input.symbols, "symbols");
    const solution = input.symbols.map((symbol) => ({
      symbol,
      weight: random.integer(0, input.maximumWeight),
    }));
    const equations = Array.from({ length: input.equationCount }, () => {
      const coefficients = input.symbols.map(() => random.integer(1, 3));
      return {
        coefficients,
        total: safe(sum(coefficients.map((c, i) => c * solution[i].weight))),
      };
    });
    const result = { solution, equations };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const balanceScaleEquationPuzzleExample = {
  input: { symbols: ["x", "y"], maximumWeight: 5, equationCount: 1, seed: 42 },
  output: {
    solution: [
      { symbol: "x", weight: 3 },
      { symbol: "y", weight: 2 },
    ],
    equations: [{ coefficients: [3, 3], total: 15 }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BalanceScaleEquationPuzzleInput,
  BalanceScaleEquationPuzzleOutput
>;
export const balanceScaleEquationPuzzleTool = createModelDefinition<
  BalanceScaleEquationPuzzleInput,
  BalanceScaleEquationPuzzleOutput
>({
  id: "random/balance-scale-equation-puzzle",
  title: "Random Balance Scale Equation Puzzle Generator",
  description:
    "Construct balanced symbolic pan equations from sampled nonnegative weights, retaining exact solutions without claiming uniqueness.",
  inputSchema,
  outputSchema,
  execute: calculateBalanceScaleEquationPuzzle,
});
export const runBalanceScaleEquationPuzzle =
  balanceScaleEquationPuzzleTool.execute;
export default balanceScaleEquationPuzzleTool;
