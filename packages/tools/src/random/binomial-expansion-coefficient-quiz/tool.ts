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
import { runCombinationCount } from "../../combinatorics/combination-count/tool.js";

export type BinomialExpansionCoefficientQuizInput = {
  readonly minimumDegree: number;
  readonly maximumDegree: number;
  readonly a: number;
  readonly b: number;
  readonly seed?: number;
};
export type BinomialExpansionCoefficientQuizOutput = {
  readonly expression: string;
  readonly degree: number;
  readonly termIndex: number;
  readonly xPower: number;
  readonly yPower: number;
  readonly coefficient: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    minimumDegree: { type: "integer", minimum: 0, maximum: 20 },
    maximumDegree: { type: "integer", minimum: 0, maximum: 20 },
    a: { type: "integer", minimum: -8, maximum: 8 },
    b: { type: "integer", minimum: -8, maximum: 8 },
    seed: generatorSeedSchema,
  },
  ["minimumDegree", "maximumDegree", "a", "b"],
);
export const outputSchema = object({
  expression: { type: "string" },
  degree: integer,
  termIndex: integer,
  xPower: integer,
  yPower: integer,
  coefficient: { type: "string", pattern: "^-?(?:0|[1-9][0-9]*)(?![\\s\\S])" },
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is BinomialExpansionCoefficientQuizInput =>
  matchesModelInput(value, inputSchema);
export const calculateBinomialExpansionCoefficientQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BinomialExpansionCoefficientQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.minimumDegree > input.maximumDegree)
      simpleError(
        "maximumDegree",
        "Degree range must be ordered.",
        "invalid_range",
      );
    const degree = random.integer(input.minimumDegree, input.maximumDegree),
      termIndex = random.integer(0, degree),
      xPower = degree - termIndex,
      yPower = termIndex,
      choose = core(
        runCombinationCount({ n: degree, k: termIndex }),
      ).combinations,
      coefficient = (
        BigInt(choose) *
        BigInt(input.a) ** BigInt(xPower) *
        BigInt(input.b) ** BigInt(yPower)
      ).toString();
    const result = {
      expression: "(" + input.a + "*x+(" + input.b + ")*y)^" + degree,
      degree,
      termIndex,
      xPower,
      yPower,
      coefficient,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const binomialExpansionCoefficientQuizExample = {
  input: { minimumDegree: 3, maximumDegree: 5, a: 2, b: -1, seed: 42 },
  output: {
    expression: "(2*x+(-1)*y)^4",
    degree: 4,
    termIndex: 2,
    xPower: 2,
    yPower: 2,
    coefficient: "24",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BinomialExpansionCoefficientQuizInput,
  BinomialExpansionCoefficientQuizOutput
>;
export const binomialExpansionCoefficientQuizTool = createModelDefinition<
  BinomialExpansionCoefficientQuizInput,
  BinomialExpansionCoefficientQuizOutput
>({
  id: "random/binomial-expansion-coefficient-quiz",
  title: "Random Binomial Expansion Coefficient Quiz Generator",
  description:
    "Generate bounded symbolic binomial term prompts and exact integer coefficient keys using delegated combination counts and BigInt powers.",
  inputSchema,
  outputSchema,
  execute: calculateBinomialExpansionCoefficientQuiz,
});
export const runBinomialExpansionCoefficientQuiz =
  binomialExpansionCoefficientQuizTool.execute;
export default binomialExpansionCoefficientQuizTool;
