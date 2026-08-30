import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FibonacciNthInput = {
  readonly n: number;
};
export type FibonacciNthOutput = {
  readonly value: string;
};

export const fibonacciNthInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 100000,
      description: "Zero-indexed term (resource limit 100000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const fibonacciNthOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Fibonacci number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A000045
export const calculateFibonacciNth = (rawInput: unknown): ToolResult<FibonacciNthOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "number" || !Number.isSafeInteger(nValue))
    return issue("n", "invalid_type", "Enter a finite safe integer.");
  if (nValue < 0)
    return issue("n", "out_of_range", "Value must be at least 0.");
  if (nValue > 100000)
    return issue("n", "resource_limit", "Value must be at most 100000.");
  const input: FibonacciNthInput = { n: nValue };
  let a = 0n, b = 1n;
  for (let i = 0; i < input.n; i++) [a, b] = [b, a + b];
  return toolSuccess({ value: a.toString() });
};

export const example = {
  input: {
    n: 50,
  },
  output: {
    value: "12586269025",
  },
} satisfies ToolExample<FibonacciNthInput, FibonacciNthOutput>;

export const fibonacciNthTool = defineTool<FibonacciNthInput, FibonacciNthOutput>({
  id: "math/fibonacci-nth",
  title: "nth Fibonacci Number",
  description: "Return F(n) exactly as a decimal string with F(0)=0 and F(1)=1; the index is capped at 100,000 for bounded computation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fibonacciNthInputSchema,
  outputSchema: fibonacciNthOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Zero-indexed term (resource limit 100000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Fibonacci number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateFibonacciNth,
});
export const runFibonacciNth = fibonacciNthTool.execute;
export default fibonacciNthTool;
