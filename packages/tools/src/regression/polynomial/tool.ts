import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolynomialRegressionInput = {
  readonly degree: number;
  readonly x: readonly number[];
  readonly y: readonly number[];
};

export type PolynomialRegressionOutput = {
  readonly coefficients: readonly number[];
  readonly rSquared: number;
};

const SINGULAR_EPSILON = 1e-12;

/** Solve A·c = b by Gauss–Jordan elimination with partial pivoting. */
const solveNormalEquations = (
  matrix: readonly (readonly number[])[],
  vector: readonly number[],
): number[] => {
  const size = vector.length;
  const rows = matrix.map((row, index) => [...row, vector[index]!]);
  for (let column = 0; column < size; column += 1) {
    let pivotRow = column;
    for (let row = column + 1; row < size; row += 1)
      if (Math.abs(rows[row]![column]!) > Math.abs(rows[pivotRow]![column]!))
        pivotRow = row;
    const pivot = Math.abs(rows[pivotRow]![column]!);
    const scale = Math.max(
      ...rows.map((row) =>
        Math.max(...row.slice(0, size).map((value) => Math.abs(value))),
      ),
    );
    if (pivot < SINGULAR_EPSILON * Math.max(1, scale))
      simpleError(
        "x",
        "The normal equations are singular for this data; distinct x values and a lower degree are needed.",
        "singular_matrix",
      );
    [rows[column], rows[pivotRow]] = [rows[pivotRow]!, rows[column]!];
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = rows[row]![column]! / rows[column]![column]!;
      for (let k = column; k <= size; k += 1)
        rows[row]![k]! -= factor * rows[column]![k]!;
    }
  }
  return rows.map((row, index) => row[size]! / row[index]!);
};

/**
 * Least-squares polynomial fit of degree d via the normal equations
 * (XᵀX)c = Xᵀy with Vandermonde X; degree is guarded to 1..6.
 */
export const calculatePolynomialRegression = (
  input: PolynomialRegressionInput,
): PolynomialRegressionOutput => {
  const xs = input.x;
  const ys = input.y;
  const degree = input.degree;
  if (xs.length !== ys.length)
    simpleError("y", "x and y must have the same length.", "length_mismatch");
  if (xs.length < degree + 1)
    simpleError(
      "degree",
      "At least degree + 1 points are required.",
      "insufficient_points",
    );
  const powerSums = Array.from({ length: 2 * degree + 1 }, (_, power) =>
    xs.reduce((sum, value) => sum + value ** power, 0),
  );
  const normal = Array.from({ length: degree + 1 }, (_, row) =>
    Array.from({ length: degree + 1 }, (_, column) => powerSums[row + column]!),
  );
  const rhs = Array.from({ length: degree + 1 }, (_, power) =>
    xs.reduce((sum, value, index) => sum + ys[index]! * value ** power, 0),
  );
  const coefficients = solveNormalEquations(normal, rhs);
  const meanY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
  const totalSumSquares = ys.reduce(
    (sum, value) => sum + (value - meanY) ** 2,
    0,
  );
  const residualSumSquares = ys.reduce((sum, value, index) => {
    let prediction = 0;
    for (let power = degree; power >= 0; power -= 1)
      prediction = prediction * xs[index]! + coefficients[power]!;
    return sum + (value - prediction) ** 2;
  }, 0);
  return {
    coefficients,
    // R² is defined as 1 when y is perfectly constant (zero variance).
    rSquared:
      totalSumSquares === 0 ? 1 : 1 - residualSumSquares / totalSumSquares,
  };
};

export const polynomialRegressionExample = {
  input: { degree: 1, x: [1, 2, 3], y: [2, 4, 6] },
  output: { coefficients: [0, 2], rSquared: 1 },
} satisfies ToolExample<PolynomialRegressionInput, PolynomialRegressionOutput>;

export const polynomialRegressionTool = createSimpleTool({
  id: "regression/polynomial",
  title: "Polynomial Regression Calculator",
  description:
    "Least-squares polynomial regression (degree 1 to 6) solved exactly through the normal equations with partial pivoting; reports ascending-power coefficients and R².",
  inputs: [
    {
      description: "Independent variable values.",
      id: "x",
      kind: "numberList",
      label: "X values",
    },
    {
      description: "Dependent variable values aligned with x.",
      id: "y",
      kind: "numberList",
      label: "Y values",
    },
    {
      default: 1,
      description: "Polynomial degree between 1 and 6.",
      id: "degree",
      kind: "integer",
      label: "Degree",
      maximum: 6,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Fitted coefficients in ascending powers c0..cd.",
      id: "coefficients",
      kind: "numberList",
      label: "Coefficients",
    },
    {
      description:
        "Coefficient of determination R² (defined as 1 for constant y).",
      id: "rSquared",
      kind: "number",
      label: "R squared",
    },
  ],
  calculate: (input) =>
    calculatePolynomialRegression({
      degree: input.degree as number,
      x: input.x as readonly number[],
      y: input.y as readonly number[],
    }),
});

export const runPolynomialRegression = polynomialRegressionTool.execute;
export default polynomialRegressionTool;
