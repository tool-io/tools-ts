import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type DivisorFunctionSigma2Input = {
  readonly n: number;
};
export type DivisorFunctionSigma2Output = {
  readonly value: string;
};

export const divisorFunctionSigma2InputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Positive integer (trial-division resource limit 10^12)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const divisorFunctionSigma2OutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Sum of squared positive divisors",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.2
export const calculateDivisorFunctionSigma2 = (rawInput: unknown): ToolResult<DivisorFunctionSigma2Output> => {
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
  if (nValue < 1)
    return issue("n", "out_of_range", "Value must be at least 1.");
  if (nValue > 1000000000000)
    return issue("n", "resource_limit", "Value must be at most 1000000000000.");
  const input: DivisorFunctionSigma2Input = { n: nValue };
  let value = 1n;
  for (const { prime, exponent } of factorPositiveInteger(input.n)) {
    const pSquared = BigInt(prime) ** 2n;
    value *= (pSquared ** BigInt(exponent + 1) - 1n) / (pSquared - 1n);
  }
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 12,
  },
  output: {
    value: "210",
  },
} satisfies ToolExample<DivisorFunctionSigma2Input, DivisorFunctionSigma2Output>;

export const divisorFunctionSigma2Tool = defineTool<DivisorFunctionSigma2Input, DivisorFunctionSigma2Output>({
  id: "math/divisor-function-sigma-2",
  title: "Sum of Squared Divisors",
  description: "Return σ₂(n), the exact sum of squares of all positive divisors, using prime-power products and trial division limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: divisorFunctionSigma2InputSchema,
  outputSchema: divisorFunctionSigma2OutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Positive integer (trial-division resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Sum of squared positive divisors",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateDivisorFunctionSigma2,
});
export const runDivisorFunctionSigma2 = divisorFunctionSigma2Tool.execute;
export default divisorFunctionSigma2Tool;
