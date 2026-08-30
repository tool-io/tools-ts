import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";
import { extendedEuclid } from "../extended-euclidean-coefficients/tool.js";

export type AbundanceRatioInput = {
  readonly n: number;
};
export type AbundanceRatioOutput = {
  readonly numerator: string;
  readonly denominator: string;
  readonly value: number;
};

export const abundanceRatioInputSchema = {
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
export const abundanceRatioOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Reduced sum-of-divisors numerator",
    },
    denominator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Reduced integer denominator",
    },
    value: {
      type: "number",
      minimum: 1,
      description: "Abundancy index",
    },
  },
  required: ["numerator", "denominator", "value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const sumPositiveDivisors = (n: number): bigint => {
  let sum = 1n;
  for (const { prime, exponent } of factorPositiveInteger(n)) {
    const p = BigInt(prime);
    sum *= (p ** BigInt(exponent + 1) - 1n) / (p - 1n);
  }
  return sum;
};

// Definition and independently known values: https://arxiv.org/abs/2106.08994; https://dlmf.nist.gov/27.2
export const calculateAbundanceRatio = (rawInput: unknown): ToolResult<AbundanceRatioOutput> => {
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
  const input: AbundanceRatioInput = { n: nValue };
  const numerator = sumPositiveDivisors(input.n), denominator = BigInt(input.n);
  const { gcd } = extendedEuclid(numerator, denominator);
  const reducedNumerator = numerator / gcd, reducedDenominator = denominator / gcd;
  return toolSuccess({ numerator: reducedNumerator.toString(), denominator: reducedDenominator.toString(), value: Number(reducedNumerator) / Number(reducedDenominator) });
};

export const example = {
  input: {
    n: 12,
  },
  output: {
    numerator: "7",
    denominator: "3",
    value: 2.3333333333333335,
  },
} satisfies ToolExample<AbundanceRatioInput, AbundanceRatioOutput>;

export const abundanceRatioTool = defineTool<AbundanceRatioInput, AbundanceRatioOutput>({
  id: "math/abundance-ratio",
  title: "Abundancy Ratio",
  description: "Compute the abundancy index σ(n)/n over all positive divisors, returning a reduced exact fraction and its floating-point value; trial division is limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: abundanceRatioInputSchema,
  outputSchema: abundanceRatioOutputSchema,
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
        id: "numerator",
        label: "Reduced sum-of-divisors numerator",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "denominator",
        label: "Reduced integer denominator",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "value",
        label: "Abundancy index",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateAbundanceRatio,
});
export const runAbundanceRatio = abundanceRatioTool.execute;
export default abundanceRatioTool;
