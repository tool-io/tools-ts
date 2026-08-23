import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuadraticEquationInput = {
  readonly a?: number;
  readonly b?: number;
  readonly c?: number;
};

export type QuadraticEquationCase =
  | "all_real_numbers"
  | "complex_roots"
  | "double_root"
  | "linear"
  | "no_solution"
  | "two_real_roots";

export type QuadraticEquationOutput = {
  readonly case: QuadraticEquationCase;
  readonly discriminant: number;
  readonly imaginaryPart: number;
  readonly realPart: number;
  readonly roots: readonly number[];
};

const finiteResult = (field: string, value: number): number => {
  if (!Number.isFinite(value))
    return simpleError(
      field,
      "The root value is outside the finite numeric range.",
      "result_not_finite",
    );
  return value;
};

/**
 * Solves a*x^2 + b*x + c = 0. Degenerate a = 0 falls back to the honest
 * linear cases. `roots` lists real solutions ascending; `realPart` and
 * `imaginaryPart` carry the complex conjugate pair only when
 * case === "complex_roots"; `discriminant` is b*b - 4*a*c (0 when a = 0).
 */
export const calculateQuadraticEquation = (
  input: QuadraticEquationInput,
): QuadraticEquationOutput => {
  const a = input.a ?? 1;
  const b = input.b ?? -3;
  const c = input.c ?? 2;
  if (a === 0) {
    if (b === 0)
      return {
        case: c === 0 ? "all_real_numbers" : "no_solution",
        discriminant: 0,
        imaginaryPart: 0,
        realPart: 0,
        roots: [],
      };
    return {
      case: "linear",
      discriminant: 0,
      imaginaryPart: 0,
      realPart: 0,
      roots: [finiteResult("roots", -c / b)],
    };
  }
  const discriminant = b * b - 4 * a * c;
  if (!Number.isFinite(discriminant))
    return simpleError(
      "discriminant",
      "The discriminant is outside the finite numeric range.",
      "result_not_finite",
    );
  const center = b === 0 ? 0 : -b / (2 * a);
  finiteResult("realPart", center);
  if (discriminant < 0)
    return {
      case: "complex_roots",
      discriminant,
      imaginaryPart: finiteResult(
        "imaginaryPart",
        Math.sqrt(-discriminant) / (2 * Math.abs(a)),
      ),
      realPart: center,
      roots: [],
    };
  if (discriminant === 0)
    return {
      case: "double_root",
      discriminant,
      imaginaryPart: 0,
      realPart: 0,
      roots: [center],
    };
  const squareRoot = Math.sqrt(discriminant);
  const q = -0.5 * (b + (b < 0 ? -squareRoot : squareRoot));
  const roots = [q / a, c / q].sort((left, right) => left - right);
  roots.forEach((root) => finiteResult("roots", root));
  return {
    case: "two_real_roots",
    discriminant,
    imaginaryPart: 0,
    realPart: 0,
    roots,
  };
};

export const quadraticEquationExample = {
  input: { a: 1, b: -3, c: 2 },
  output: {
    case: "two_real_roots",
    discriminant: 1,
    imaginaryPart: 0,
    realPart: 0,
    roots: [1, 2],
  },
} satisfies ToolExample<QuadraticEquationInput, QuadraticEquationOutput>;

export const quadraticEquationTool = createSimpleTool({
  id: "algebra/quadratic-equation",
  title: "Quadratic Equation Solver",
  description:
    "Solve a*x^2 + b*x + c = 0 with explicit discriminant branches; degenerate a = 0 equations fall back to honest linear, no-solution or all-real-numbers cases.",
  inputs: [
    {
      default: 1,
      description: "Coefficient of x^2; zero degrades to a linear equation.",
      id: "a",
      kind: "number",
      label: "a",
    },
    {
      default: -3,
      description: "Coefficient of x.",
      id: "b",
      kind: "number",
      label: "b",
    },
    {
      default: 2,
      description: "Constant term.",
      id: "c",
      kind: "number",
      label: "c",
    },
  ],
  outputs: [
    {
      description:
        "Resolution case: two_real_roots, double_root, complex_roots, linear, no_solution or all_real_numbers.",
      enum: [
        "all_real_numbers",
        "complex_roots",
        "double_root",
        "linear",
        "no_solution",
        "two_real_roots",
      ],
      id: "case",
      kind: "string",
      label: "Case",
    },
    {
      description: "Discriminant b*b - 4*a*c; reported as 0 when a = 0.",
      id: "discriminant",
      kind: "number",
      label: "Discriminant",
    },
    {
      description:
        "Real solutions sorted ascending; empty for complex or degenerate no/all-solution cases.",
      id: "roots",
      kind: "numberList",
      label: "Roots",
    },
    {
      description:
        "Real part of the complex pair when case is complex_roots, else 0.",
      id: "realPart",
      kind: "number",
      label: "Real part",
    },
    {
      description:
        "Nonnegative imaginary magnitude of the complex pair when case is complex_roots, else 0.",
      id: "imaginaryPart",
      kind: "number",
      label: "Imaginary part",
    },
  ],
  calculate: (input) =>
    calculateQuadraticEquation(input as QuadraticEquationInput),
});

export const runQuadraticEquation = quadraticEquationTool.execute;
export default quadraticEquationTool;
