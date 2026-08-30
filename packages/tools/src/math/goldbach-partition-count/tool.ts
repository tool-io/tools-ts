import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { sievePrimes } from "../chebyshev-theta/tool.js";

export type GoldbachPartitionCountInput = {
  readonly n: number;
};
export type GoldbachPartitionCountOutput = {
  readonly count: number;
};

export const goldbachPartitionCountInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 4,
      maximum: 1000000,
      description: "Even integer at least four (sieve resource limit 1000000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const goldbachPartitionCountOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: {
      type: "integer",
      minimum: 0,
      maximum: 500000,
      description: "Unordered Goldbach partition count",
    },
  },
  required: ["count"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A045917
export const calculateGoldbachPartitionCount = (rawInput: unknown): ToolResult<GoldbachPartitionCountOutput> => {
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
  if (nValue < 4)
    return issue("n", "out_of_range", "Value must be at least 4.");
  if (nValue > 1000000)
    return issue("n", "resource_limit", "Value must be at most 1000000.");
  const input: GoldbachPartitionCountInput = { n: nValue };
  if (input.n % 2 !== 0) return issue("n", "invalid_parity", "Goldbach input must be even.");
  const flags = sievePrimes(input.n);
  let count = 0;
  for (let p = 2; p <= input.n / 2; p++) if (flags[p] === 1 && flags[input.n - p] === 1) count++;
  return toolSuccess({ count });
};

export const example = {
  input: {
    n: 26,
  },
  output: {
    count: 3,
  },
} satisfies ToolExample<GoldbachPartitionCountInput, GoldbachPartitionCountOutput>;

export const goldbachPartitionCountTool = defineTool<GoldbachPartitionCountInput, GoldbachPartitionCountOutput>({
  id: "math/goldbach-partition-count",
  title: "Goldbach Partition Count",
  description: "Count unordered prime pairs p≤q with p+q equal to an even n≥4, including equal-prime pairs, using a sieve limited to n≤1,000,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: goldbachPartitionCountInputSchema,
  outputSchema: goldbachPartitionCountOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Even integer at least four (sieve resource limit 1000000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "count",
        label: "Unordered Goldbach partition count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateGoldbachPartitionCount,
});
export const runGoldbachPartitionCount = goldbachPartitionCountTool.execute;
export default goldbachPartitionCountTool;
