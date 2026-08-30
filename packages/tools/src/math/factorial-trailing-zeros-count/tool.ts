import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FactorialTrailingZerosCountInput = {
  readonly n: string;
};
export type FactorialTrailingZerosCountOutput = {
  readonly zeros: string;
};

export const factorialTrailingZerosCountInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Nonnegative factorial argument",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const factorialTrailingZerosCountOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeros: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Number of trailing decimal zeros",
    },
  },
  required: ["zeros"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A027868
export const calculateFactorialTrailingZerosCount = (rawInput: unknown): ToolResult<FactorialTrailingZerosCountOutput> => {
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
  if (!/^(0|[1-9][0-9]*)$/.test(nValue))
    return issue("n", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: FactorialTrailingZerosCountInput = { n: nValue };
  let count = 0n;
  for (let quotient = BigInt(input.n) / 5n; quotient > 0n; quotient /= 5n) count += quotient;
  return toolSuccess({ zeros: count.toString() });
};

export const example = {
  input: {
    n: "100",
  },
  output: {
    zeros: "24",
  },
} satisfies ToolExample<FactorialTrailingZerosCountInput, FactorialTrailingZerosCountOutput>;

export const factorialTrailingZerosCountTool = defineTool<FactorialTrailingZerosCountInput, FactorialTrailingZerosCountOutput>({
  id: "math/factorial-trailing-zeros-count",
  title: "Trailing Zeros in n Factorial",
  description: "Count decimal trailing zeros of n! exactly by counting factors of five, accepting nonnegative decimal integers up to 200 characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: factorialTrailingZerosCountInputSchema,
  outputSchema: factorialTrailingZerosCountOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative factorial argument",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "zeros",
        label: "Number of trailing decimal zeros",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateFactorialTrailingZerosCount,
});
export const runFactorialTrailingZerosCount = factorialTrailingZerosCountTool.execute;
export default factorialTrailingZerosCountTool;
