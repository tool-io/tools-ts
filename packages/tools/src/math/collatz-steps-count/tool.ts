import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CollatzStepsCountInput = {
  readonly n: string;
};
export type CollatzStepsCountOutput = {
  readonly steps: number;
};

export const collatzStepsCountInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "string",
      pattern: "^[1-9][0-9]*$",
      maxLength: 200,
      description: "Positive starting integer",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const collatzStepsCountOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    steps: {
      type: "integer",
      minimum: 0,
      maximum: 10000,
      description: "Full Collatz steps to first reach one",
    },
  },
  required: ["steps"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A006577
export const calculateCollatzStepsCount = (rawInput: unknown): ToolResult<CollatzStepsCountOutput> => {
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
  if (typeof nValue !== "string")
    return issue("n", "invalid_type", "Enter an integer as a decimal string.");
  if (nValue.length > 200)
    return issue("n", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^[1-9][0-9]*$/.test(nValue))
    return issue("n", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: CollatzStepsCountInput = { n: nValue };
  let value = BigInt(input.n), steps = 0;
  while (value !== 1n && steps < 10000) {
    value = value % 2n === 0n ? value / 2n : 3n * value + 1n;
    steps++;
  }
  if (value !== 1n) return issue("n", "iteration_limit", "Sequence did not reach one within 10000 steps.");
  return toolSuccess({ steps });
};

export const example = {
  input: {
    n: "27",
  },
  output: {
    steps: 111,
  },
} satisfies ToolExample<CollatzStepsCountInput, CollatzStepsCountOutput>;

export const collatzStepsCountTool = defineTool<CollatzStepsCountInput, CollatzStepsCountOutput>({
  id: "math/collatz-steps-count",
  title: "Collatz Steps to One",
  description: "Count full Collatz steps from a positive decimal integer to one using even n/2 and odd 3n+1, reporting a resource error if one is not reached within 10,000 steps.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: collatzStepsCountInputSchema,
  outputSchema: collatzStepsCountOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Positive starting integer",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "steps",
        label: "Full Collatz steps to first reach one",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateCollatzStepsCount,
});
export const runCollatzStepsCount = collatzStepsCountTool.execute;
export default collatzStepsCountTool;
