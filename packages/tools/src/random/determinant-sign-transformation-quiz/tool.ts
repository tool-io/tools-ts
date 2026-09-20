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
import {
  validateSmallSquare,
  rowTransition,
  determinant,
  type RowOperation,
} from "../m500b-charts-math-graphs-row-operations.js";

export type DeterminantSignTransformationQuizInput = {
  readonly matrix: readonly (readonly number[])[];
  readonly operation: "swap" | "scale";
  readonly seed?: number;
};
export type DeterminantSignTransformationQuizOutput = {
  readonly before: number;
  readonly after: number;
  readonly matrix: readonly (readonly number[])[];
  readonly operation: RowOperation;
  readonly multiplier: number;
  readonly signChanged: boolean;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    matrix: array(array(integer, 3, 2), 3, 2),
    operation: { type: "string", enum: ["swap", "scale"] },
    seed: generatorSeedSchema,
  },
  ["matrix", "operation"],
);
export const outputSchema = object({
  before: number,
  after: number,
  matrix: array(array(integer, 3, 2), 3, 2),
  operation: object({
    kind: { type: "string", enum: ["swap", "scale", "add"] },
    row: integer,
    other: integer,
    factor: integer,
  }),
  multiplier: number,
  signChanged: bool,
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is DeterminantSignTransformationQuizInput =>
  matchesModelInput(value, inputSchema);
export const calculateDeterminantSignTransformationQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DeterminantSignTransformationQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    validateSmallSquare(input.matrix);
    const before = determinant(input.matrix),
      transition = rowTransition(input.matrix, [input.operation], random),
      after = determinant(transition.matrix);
    const result = {
      before,
      after,
      ...transition,
      signChanged:
        before !== 0 && after !== 0 && Math.sign(before) !== Math.sign(after),
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const determinantSignTransformationQuizExample = {
  input: {
    matrix: [
      [2, 0],
      [0, 3],
    ],
    operation: "swap",
    seed: 42,
  },
  output: {
    before: 6,
    after: -6,
    matrix: [
      [0, 3],
      [2, 0],
    ],
    operation: { kind: "swap", row: 0, other: 1, factor: -1 },
    multiplier: -1,
    signChanged: true,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DeterminantSignTransformationQuizInput,
  DeterminantSignTransformationQuizOutput
>;
export const determinantSignTransformationQuizTool = createModelDefinition<
  DeterminantSignTransformationQuizInput,
  DeterminantSignTransformationQuizOutput
>({
  id: "random/determinant-sign-transformation-quiz",
  title: "Random Determinant Sign Transformation Quiz Generator",
  description:
    "Draw a supported row swap or scaling and retain its determinant sign rule, inheriting the delegated determinant core's 12-significant-digit rounding.",
  inputSchema,
  outputSchema,
  execute: calculateDeterminantSignTransformationQuiz,
});
export const runDeterminantSignTransformationQuiz =
  determinantSignTransformationQuizTool.execute;
export default determinantSignTransformationQuizTool;
