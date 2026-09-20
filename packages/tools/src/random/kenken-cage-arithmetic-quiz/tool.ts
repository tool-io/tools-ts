import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculate as checkCage } from "../../game/kenken-cage-target-product-sum-validator/tool.js";
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
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type KenkenOperation =
  "sum" | "product" | "difference" | "quotient" | "single";
export type KenkenCageArithmeticQuizInput = {
  readonly gridOrder: number;
  readonly cellCount: number;
  readonly operation: KenkenOperation;
  readonly seed?: number;
};
export type KenkenCageArithmeticQuizOutput = {
  readonly puzzle: {
    readonly operation: KenkenOperation;
    readonly target: number;
    readonly cells: readonly number[];
    readonly hiddenIndex: number;
  };
  readonly answer: {
    readonly values: readonly number[];
    readonly replacementValues: readonly number[];
    readonly targetMatches: boolean;
  };
  readonly randomness: GeneratorReplay;
};
const operationSchema = {
  type: "string",
  enum: ["sum", "product", "difference", "quotient", "single"],
} as const;
export const inputSchema = puzzleObject(
  {
    gridOrder: { type: "integer", minimum: 1, maximum: 16 },
    cellCount: { type: "integer", minimum: 1, maximum: 8 },
    operation: operationSchema,
    seed: generatorSeedSchema,
  },
  ["gridOrder", "cellCount", "operation"],
);
export const outputSchema = puzzleObject({
  puzzle: puzzleObject({
    operation: operationSchema,
    target: { type: "number" },
    cells: puzzleArray(puzzleInteger, 8),
    hiddenIndex: puzzleInteger,
  }),
  answer: puzzleObject({
    values: puzzleArray(puzzleInteger, 8),
    replacementValues: puzzleArray(puzzleInteger, 16),
    targetMatches: { type: "boolean" },
  }),
  randomness: generatorReplaySchema,
});
export const calculateKenkenCageArithmeticQuiz = (
  input: KenkenCageArithmeticQuizInput,
  context?: ToolExecutionContext,
): ToolResult<KenkenCageArithmeticQuizOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    if (
      (input.operation === "single" && input.cellCount !== 1) ||
      ((input.operation === "difference" || input.operation === "quotient") &&
        input.cellCount !== 2)
    )
      simpleError(
        "cellCount",
        "Single requires one cell; difference and quotient require two.",
        "operation_arity",
      );
    if (input.operation === "difference" && input.gridOrder === 1)
      simpleError(
        "gridOrder",
        "A positive difference requires at least two values.",
        "infeasible_operation",
      );
    const random = createGeneratorRandom(input.seed, context),
      values = Array.from({ length: input.cellCount }, () =>
        random.integer(1, input.gridOrder),
      );
    if (input.operation === "difference")
      values[1] =
        ((values[0] - 1 + random.integer(1, input.gridOrder - 1)) %
          input.gridOrder) +
        1;
    const target =
      input.operation === "sum"
        ? values.reduce((a, b) => a + b, 0)
        : input.operation === "product"
          ? values.reduce((a, b) => a * b, 1)
          : input.operation === "difference"
            ? Math.abs(values[0] - values[1])
            : input.operation === "quotient"
              ? Math.max(...values) / Math.min(...values)
              : values[0];
    const core = checkCage({
        cageValues: values,
        callerGridOrder: input.gridOrder,
        operation: input.operation,
        targetValue: target,
      }),
      hiddenIndex = random.integer(0, input.cellCount - 1),
      cells = values.map((v, i) => (i === hiddenIndex ? 0 : v)),
      replacementValues: number[] = [];
    for (let digit = 1; digit <= input.gridOrder; digit += 1) {
      const candidate = values.map((v, i) => (i === hiddenIndex ? digit : v));
      if (
        checkCage({
          cageValues: candidate,
          callerGridOrder: input.gridOrder,
          operation: input.operation,
          targetValue: target,
        }).cageTargetMatches
      )
        replacementValues.push(digit);
    }
    return toolSuccess({
      puzzle: { operation: input.operation, target, cells, hiddenIndex },
      answer: {
        values,
        replacementValues,
        targetMatches: core.cageTargetMatches,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const kenkenCageArithmeticQuizExample = puzzleFreeze({
  input: { gridOrder: 6, cellCount: 2, operation: "product", seed: 42 },
  output: {
    puzzle: { operation: "product", target: 12, cells: [4, 0], hiddenIndex: 1 },
    answer: { values: [4, 3], replacementValues: [3], targetMatches: true },
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  KenkenCageArithmeticQuizInput,
  KenkenCageArithmeticQuizOutput
>);
const isInput = (input: unknown): input is KenkenCageArithmeticQuizInput =>
  matchesModelInput(input, inputSchema);
export const kenkenCageArithmeticQuizTool = createModelDefinition<
  KenkenCageArithmeticQuizInput,
  KenkenCageArithmeticQuizOutput
>({
  id: "random/kenken-cage-arithmetic-quiz",
  title: "Random KenKen Cage Arithmetic Quiz Generator",
  description:
    "Generate a positive-target KenKen cage question and every valid hidden-cell replacement using cage arithmetic only, without global Latin-square constraints.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateKenkenCageArithmeticQuiz,
  ),
});
export const runKenkenCageArithmeticQuiz = kenkenCageArithmeticQuizTool.execute;
export default kenkenCageArithmeticQuizTool;
