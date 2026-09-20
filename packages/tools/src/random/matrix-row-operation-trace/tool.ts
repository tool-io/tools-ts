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
  type RowOperationKind,
} from "../m500b-charts-math-graphs-row-operations.js";

export type MatrixRowOperationTraceInput = {
  readonly matrix: readonly (readonly number[])[];
  readonly operationCount: number;
  readonly operations: readonly RowOperationKind[];
  readonly seed?: number;
};
export type MatrixRowOperationTraceOutput = {
  readonly initial: readonly (readonly number[])[];
  readonly initialDeterminant: number;
  readonly steps: readonly {
    readonly operation: RowOperation;
    readonly matrix: readonly (readonly number[])[];
    readonly determinant: number;
    readonly multiplier: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    matrix: array(array(integer, 3, 2), 3, 2),
    operationCount: { type: "integer", minimum: 1, maximum: 8 },
    operations: array({ type: "string", enum: ["swap", "scale", "add"] }, 3, 1),
    seed: generatorSeedSchema,
  },
  ["matrix", "operationCount", "operations"],
);
export const outputSchema = object({
  initial: array(array(integer, 3, 2), 3, 2),
  initialDeterminant: number,
  steps: array(
    object({
      operation: object({
        kind: { type: "string", enum: ["swap", "scale", "add"] },
        row: integer,
        other: integer,
        factor: integer,
      }),
      matrix: array(array(integer, 3, 2), 3, 2),
      determinant: number,
      multiplier: number,
    }),
    8,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is MatrixRowOperationTraceInput =>
  matchesModelInput(value, inputSchema);
export const calculateMatrixRowOperationTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MatrixRowOperationTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    validateSmallSquare(input.matrix);
    distinct(input.operations, "operations");
    const initial = input.matrix.map((r) => r.map((v) => finite(v))),
      initialDeterminant = determinant(initial);
    let current = initial;
    const steps = Array.from({ length: input.operationCount }, () => {
      const transition = rowTransition(current, input.operations, random);
      current = transition.matrix;
      return { ...transition, determinant: determinant(current) };
    });
    const result = { initial, initialDeterminant, steps };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const matrixRowOperationTraceExample = {
  input: {
    matrix: [
      [1, 2],
      [3, 4],
    ],
    operationCount: 1,
    operations: ["swap"],
    seed: 42,
  },
  output: {
    initial: [
      [1, 2],
      [3, 4],
    ],
    initialDeterminant: -2,
    steps: [
      {
        operation: { kind: "swap", row: 0, other: 1, factor: -1 },
        matrix: [
          [3, 4],
          [1, 2],
        ],
        multiplier: -1,
        determinant: 2,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  MatrixRowOperationTraceInput,
  MatrixRowOperationTraceOutput
>;
export const matrixRowOperationTraceTool = createModelDefinition<
  MatrixRowOperationTraceInput,
  MatrixRowOperationTraceOutput
>({
  id: "random/matrix-row-operation-trace",
  title: "Random Matrix Row Operation Trace Generator",
  description:
    "Generate elementary row-operation traces with exact safe-integer intermediate matrices and delegated determinants inheriting 12-significant-digit core rounding.",
  inputSchema,
  outputSchema,
  execute: calculateMatrixRowOperationTrace,
});
export const runMatrixRowOperationTrace = matrixRowOperationTraceTool.execute;
export default matrixRowOperationTraceTool;
