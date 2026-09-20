import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export type SolveLinearSystemInput = {
  readonly coefficients: readonly (readonly number[])[];
  readonly rightHandSide: readonly number[];
  readonly absoluteTolerance?: number;
};
export type SolveLinearSystemOutput = {
  readonly augmentedRank: number;
  readonly coefficientRank: number;
  readonly nullspaceBasis: readonly (readonly number[])[];
  readonly particularSolution: readonly number[];
  readonly reducedAugmentedMatrix: readonly (readonly number[])[];
  readonly solutionType: "inconsistent" | "infinite" | "unique";
};
const vectorSchema = {
  items: { type: "number" },
  maxItems: 32,
  type: "array",
} as const;
export const inputSchema = {
  additionalProperties: false,
  properties: {
    coefficients: {
      items: { ...vectorSchema, minItems: 1 },
      minItems: 1,
      maxItems: 32,
      type: "array",
    },
    rightHandSide: { ...vectorSchema, minItems: 1 },
    absoluteTolerance: {
      description:
        "Absolute zero threshold applied at each elimination stage; default 0 tests floating-point zeros exactly. A positive threshold gives an approximate classification, not a certified rank.",
      default: 0,
      minimum: 0,
      type: "number",
    },
  },
  required: ["coefficients", "rightHandSide"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    augmentedRank: { minimum: 0, maximum: 32, type: "integer" },
    coefficientRank: { minimum: 0, maximum: 32, type: "integer" },
    nullspaceBasis: { items: vectorSchema, maxItems: 32, type: "array" },
    particularSolution: vectorSchema,
    reducedAugmentedMatrix: {
      items: {
        items: { type: "number" },
        minItems: 2,
        maxItems: 33,
        type: "array",
      },
      minItems: 1,
      maxItems: 32,
      type: "array",
    },
    solutionType: {
      enum: ["inconsistent", "infinite", "unique"],
      type: "string",
    },
  },
  required: [
    "augmentedRank",
    "coefficientRank",
    "nullspaceBasis",
    "particularSolution",
    "reducedAugmentedMatrix",
    "solutionType",
  ],
  type: "object",
} as const;
const isInput = (input: unknown): input is SolveLinearSystemInput =>
  matchesModelInput(input, inputSchema);
const numericFailure = (field: string): ToolResult<never> =>
  invalidInput([
    {
      code: "numeric_overflow",
      field,
      message:
        "Elimination produced an unrepresentable finite-number result; rescale the equations or use higher-precision arithmetic.",
    },
  ]);

/** Partial-pivot Gauss–Jordan on the full augmented matrix, including contradiction pivots. */
export const calculateSolveLinearSystem = (
  input: unknown,
): ToolResult<SolveLinearSystemOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  const rows = input.coefficients.length,
    columns = input.coefficients[0].length;
  if (input.coefficients.some((row) => row.length !== columns))
    return invalidInput([
      {
        code: "ragged_coefficients",
        field: "coefficients",
        message: "Every coefficient row must have the same length.",
      },
    ]);
  if (input.rightHandSide.length !== rows)
    return invalidInput([
      {
        code: "dimension_mismatch",
        field: "rightHandSide",
        message: "Provide one right-hand-side value for every equation.",
      },
    ]);
  const tolerance = input.absoluteTolerance ?? 0;
  const reducedAugmentedMatrix = input.coefficients.map((row, i) => [
    ...row,
    input.rightHandSide[i],
  ]);
  const pivots: number[] = [];
  for (let column = 0; column <= columns && pivots.length < rows; column += 1) {
    const pivotIndex = pivots.length;
    let pivotRow = pivotIndex;
    for (let row = pivotIndex + 1; row < rows; row += 1)
      if (
        Math.abs(reducedAugmentedMatrix[row][column]) >
        Math.abs(reducedAugmentedMatrix[pivotRow][column])
      )
        pivotRow = row;
    if (Math.abs(reducedAugmentedMatrix[pivotRow][column]) <= tolerance) {
      for (let row = pivotIndex; row < rows; row += 1)
        reducedAugmentedMatrix[row][column] = 0;
      continue;
    }
    const moved = reducedAugmentedMatrix[pivotRow];
    reducedAugmentedMatrix[pivotRow] = reducedAugmentedMatrix[pivotIndex];
    reducedAugmentedMatrix[pivotIndex] = moved;
    const pivot = reducedAugmentedMatrix[pivotIndex][column];
    for (let j = column + 1; j <= columns; j += 1) {
      const value = reducedAugmentedMatrix[pivotIndex][j] / pivot;
      if (!Number.isFinite(value))
        return numericFailure(j === columns ? "rightHandSide" : "coefficients");
      reducedAugmentedMatrix[pivotIndex][j] = value === 0 ? 0 : value;
    }
    reducedAugmentedMatrix[pivotIndex][column] = 1;
    for (let row = 0; row < rows; row += 1) {
      if (row === pivotIndex) continue;
      const factor = reducedAugmentedMatrix[row][column];
      reducedAugmentedMatrix[row][column] = 0;
      if (Math.abs(factor) <= tolerance) continue;
      for (let j = column + 1; j <= columns; j += 1) {
        const value =
          reducedAugmentedMatrix[row][j] -
          factor * reducedAugmentedMatrix[pivotIndex][j];
        if (!Number.isFinite(value))
          return numericFailure(
            j === columns ? "rightHandSide" : "coefficients",
          );
        reducedAugmentedMatrix[row][j] = value === 0 ? 0 : value;
      }
    }
    pivots.push(column);
  }
  const coefficientPivots = pivots.filter((column) => column < columns);
  const coefficientRank = coefficientPivots.length,
    augmentedRank = pivots.length;
  const inconsistent = augmentedRank > coefficientRank;
  const particularSolution = inconsistent ? [] : Array<number>(columns).fill(0);
  if (!inconsistent)
    coefficientPivots.forEach((column, row) => {
      particularSolution[column] = reducedAugmentedMatrix[row][columns];
    });
  const pivotSet = new Set(coefficientPivots);
  const nullspaceBasis: number[][] = [];
  for (let free = 0; free < columns; free += 1) {
    if (pivotSet.has(free)) continue;
    const vector = Array<number>(columns).fill(0);
    vector[free] = 1;
    coefficientPivots.forEach((column, row) => {
      const value = -reducedAugmentedMatrix[row][free];
      vector[column] = value === 0 ? 0 : value;
    });
    nullspaceBasis.push(vector);
  }
  return toolSuccess({
    augmentedRank,
    coefficientRank,
    nullspaceBasis,
    particularSolution,
    reducedAugmentedMatrix,
    solutionType: inconsistent
      ? "inconsistent"
      : coefficientRank === columns
        ? "unique"
        : "infinite",
  });
};
export const solveLinearSystemExample = {
  input: {
    coefficients: [
      [0, 1, 1],
      [2, 2, 0],
      [0, 0, 1],
    ],
    rightHandSide: [5, 6, 3],
  },
  output: {
    augmentedRank: 3,
    coefficientRank: 3,
    nullspaceBasis: [],
    particularSolution: [1, 2, 3],
    reducedAugmentedMatrix: [
      [1, 0, 0, 1],
      [0, 1, 0, 2],
      [0, 0, 1, 3],
    ],
    solutionType: "unique",
  },
} satisfies ToolExample<SolveLinearSystemInput, SolveLinearSystemOutput>;
export const solveLinearSystemTool = createModelDefinition<
  SolveLinearSystemInput,
  SolveLinearSystemOutput
>({
  id: "algebra/solve-linear-system",
  title: "General Linear System Solver",
  description:
    "Use bounded partial-pivot Gauss–Jordan elimination to classify a rectangular real linear system and return a particular solution, coefficient nullspace, and reduced augmented matrix under an explicit zero threshold, without a conditioning guarantee.",
  inputSchema,
  outputSchema,
  execute: calculateSolveLinearSystem,
});
export const runSolveLinearSystem = solveLinearSystemTool.execute;
export default solveLinearSystemTool;
