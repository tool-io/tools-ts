import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NonConvexFunction = "double-well" | "rastrigin-1d";
export type NonConvexSolution = {
  readonly function: NonConvexFunction;
  readonly minimum: number;
  readonly x: number;
};

const functions = {
  "double-well": {
    gradient: (x: number) => 4 * x * (x * x - 1),
    value: (x: number) => (x * x - 1) ** 2,
  },
  "rastrigin-1d": {
    gradient: (x: number) => 2 * x + 20 * Math.PI * Math.sin(2 * Math.PI * x),
    value: (x: number) => x * x - 10 * Math.cos(2 * Math.PI * x) + 10,
  },
} as const;

export const solveNonConvexMultistart = (
  functionName: NonConvexFunction,
  minimum: number,
  maximum: number,
  starts: number,
  iterations: number,
  learningRate: number,
): NonConvexSolution | null => {
  if (minimum >= maximum || starts * iterations > 10_000_000) return null;
  const definition = functions[functionName];
  let bestX = minimum;
  let bestValue = Infinity;
  for (let start = 0; start < starts; start += 1) {
    let x = minimum + (start / (starts - 1)) * (maximum - minimum);
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const next = x - learningRate * definition.gradient(x);
      if (!Number.isFinite(next)) return null;
      x = Math.min(maximum, Math.max(minimum, next));
    }
    const value = definition.value(x);
    if (!Number.isFinite(value)) return null;
    if (value < bestValue) {
      bestValue = value;
      bestX = x;
    }
  }
  return {
    function: functionName,
    minimum: Number(bestValue.toPrecision(12)),
    x: Number(bestX.toPrecision(12)),
  };
};

export const nonConvexMultistartExample = {
  input: {
    function: "double-well",
    iterations: 200,
    learningRate: 0.01,
    maximum: 3,
    minimum: -3,
    starts: 21,
  },
  output: {
    solution: {
      function: "double-well",
      minimum: 1.85166062939e-16,
      x: -0.999999993196,
    },
  },
} satisfies ToolExample<
  {
    readonly function: NonConvexFunction;
    readonly iterations: number;
    readonly learningRate: number;
    readonly maximum: number;
    readonly minimum: number;
    readonly starts: number;
  },
  { readonly solution: NonConvexSolution }
>;

export const nonConvexMultistartTool = createSimpleTool({
  id: "optimization/non-convex-multistart",
  title: "Non-Convex Multistart Solver",
  description:
    "Run bounded multistart gradient descent on a selected one-dimensional non-convex benchmark.",
  inputs: [
    {
      enum: ["double-well", "rastrigin-1d"],
      id: "function",
      kind: "string",
      label: "Function",
    },
    { id: "minimum", kind: "number", label: "Minimum X" },
    { id: "maximum", kind: "number", label: "Maximum X" },
    {
      id: "starts",
      kind: "integer",
      label: "Starting points",
      maximum: 10_000,
      minimum: 2,
    },
    {
      id: "iterations",
      kind: "integer",
      label: "Iterations",
      maximum: 100_000,
      minimum: 1,
    },
    {
      id: "learningRate",
      kind: "number",
      label: "Learning rate",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "optimization/solution",
      id: "solution",
      kind: "object",
      label: "Best solution",
    },
  ],
  calculate: (input) => {
    const solution = solveNonConvexMultistart(
      input.function as NonConvexFunction,
      input.minimum as number,
      input.maximum as number,
      input.starts as number,
      input.iterations as number,
      input.learningRate as number,
    );
    if (!solution)
      return simpleError(
        "minimum",
        "Enter ordered bounds and a feasible work size.",
      );
    return { solution };
  },
});

export const runNonConvexMultistart = nonConvexMultistartTool.execute;
export default nonConvexMultistartTool;
