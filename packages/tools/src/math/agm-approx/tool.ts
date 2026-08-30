import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AgmApproxInput = {
  readonly first: number;
  readonly second: number;
  readonly iterations: number;
};
export type AgmApproxOutput = {
  readonly value: number;
  readonly geometric: number;
};

export const agmApproxInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "number",
      minimum: 0,
      description: "First nonnegative value",
    },
    second: {
      type: "number",
      minimum: 0,
      description: "Second nonnegative value",
    },
    iterations: {
      type: "integer",
      minimum: 0,
      maximum: 128,
      description: "Mean iteration count (resource limit 128)",
    },
  },
  required: ["first", "second", "iterations"],
} as const satisfies ToolJsonSchema;
export const agmApproxOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      minimum: 0,
      description: "Final arithmetic iterate",
    },
    geometric: {
      type: "number",
      minimum: 0,
      description: "Final geometric iterate",
    },
  },
  required: ["value", "geometric"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/19.8
export const calculateAgmApprox = (rawInput: unknown): ToolResult<AgmApproxOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly first?: unknown;
    readonly second?: unknown;
    readonly iterations?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["first", "second", "iterations"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const firstValue = candidate.first;
  if (typeof firstValue !== "number" || !Number.isFinite(firstValue))
    return issue("first", "invalid_type", "Enter a finite number.");
  if (firstValue < 0)
    return issue("first", "out_of_range", "Value must be at least 0.");
  const secondValue = candidate.second;
  if (typeof secondValue !== "number" || !Number.isFinite(secondValue))
    return issue("second", "invalid_type", "Enter a finite number.");
  if (secondValue < 0)
    return issue("second", "out_of_range", "Value must be at least 0.");
  const iterationsValue = candidate.iterations;
  if (typeof iterationsValue !== "number" || !Number.isSafeInteger(iterationsValue))
    return issue("iterations", "invalid_type", "Enter a finite safe integer.");
  if (iterationsValue < 0)
    return issue("iterations", "out_of_range", "Value must be at least 0.");
  if (iterationsValue > 128)
    return issue("iterations", "resource_limit", "Value must be at most 128.");
  const input: AgmApproxInput = { first: firstValue, second: secondValue, iterations: iterationsValue };
  let arithmetic = Math.max(input.first, input.second), geometric = Math.min(input.first, input.second);
  for (let iteration = 0; iteration < input.iterations; iteration++) {
    if (arithmetic === geometric) break;
    const sum = arithmetic + geometric, product = arithmetic * geometric;
    const nextArithmetic = Number.isFinite(sum) ? sum / 2 : arithmetic / 2 + geometric / 2;
    const nextGeometric = Number.isFinite(product) && product > 0 ? Math.sqrt(product) : Math.sqrt(arithmetic) * Math.sqrt(geometric);
    arithmetic = nextArithmetic;
    geometric = Math.min(nextArithmetic, nextGeometric);
  }
  if (!Number.isFinite(arithmetic) || !Number.isFinite(geometric)) return issue("first", "numeric_range", "Iterates must remain finite.");
  return toolSuccess({ value: arithmetic === 0 ? 0 : arithmetic, geometric: geometric === 0 ? 0 : geometric });
};

export const example = {
  input: {
    first: 4,
    second: 1,
    iterations: 1,
  },
  output: {
    value: 2.5,
    geometric: 2,
  },
} satisfies ToolExample<AgmApproxInput, AgmApproxOutput>;

export const agmApproxTool = defineTool<AgmApproxInput, AgmApproxOutput>({
  id: "math/agm-approx",
  title: "Arithmetic–Geometric Mean Iterates",
  description: "Approximate the arithmetic–geometric mean of two finite nonnegative values with the requested number of iterations, returning both final iterates and limiting work to 128 iterations.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: agmApproxInputSchema,
  outputSchema: agmApproxOutputSchema,
  ports: {
    inputs: [
      {
        id: "first",
        label: "First nonnegative value",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "second",
        label: "Second nonnegative value",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "iterations",
        label: "Mean iteration count (resource limit 128)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Final arithmetic iterate",
        valueType: {
          type: "number",
        },
      },
      {
        id: "geometric",
        label: "Final geometric iterate",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateAgmApprox,
});
export const runAgmApprox = agmApproxTool.execute;
export default agmApproxTool;
