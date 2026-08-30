import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PracticalNumberCheckerInput = {
  readonly n: number;
};
export type PracticalNumberCheckerOutput = {
  readonly isPractical: boolean;
};

export const practicalNumberCheckerInputSchema = {
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
export const practicalNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isPractical: {
      type: "boolean",
      description: "Whether n is practical",
    },
  },
  required: ["isPractical"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export type PrimePowerFactor = { readonly prime: number; readonly exponent: number };
// Exact trial division for the positive safe integers admitted by these tools.
export const factorPositiveInteger = (value: number): ReadonlyArray<PrimePowerFactor> => {
  if (!Number.isSafeInteger(value) || value < 1 || value > 1000000000000) throw new RangeError("Factorization requires an integer in 1..10^12.");
  let remaining = value;
  const factors: PrimePowerFactor[] = [];
  for (let divisor = 2; divisor <= remaining / divisor; divisor += divisor === 2 ? 1 : 2) {
    let exponent = 0;
    while (remaining % divisor === 0) { remaining /= divisor; exponent++; }
    if (exponent > 0) factors.push({ prime: divisor, exponent });
  }
  if (remaining > 1) factors.push({ prime: remaining, exponent: 1 });
  return factors;
};
export const isPrimeInteger = (value: number): boolean => {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor <= value / divisor; divisor += 2) if (value % divisor === 0) return false;
  return true;
};

// Definition and independently known values: https://oeis.org/A005153
export const calculatePracticalNumberChecker = (rawInput: unknown): ToolResult<PracticalNumberCheckerOutput> => {
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
  const input: PracticalNumberCheckerInput = { n: nValue };
  let sigma = 1n;
  for (const { prime, exponent } of factorPositiveInteger(input.n)) {
    const p = BigInt(prime);
    if (p > sigma + 1n) return toolSuccess({ isPractical: false });
    sigma *= (p ** BigInt(exponent + 1) - 1n) / (p - 1n);
  }
  return toolSuccess({ isPractical: true });
};

export const example = {
  input: {
    n: 30,
  },
  output: {
    isPractical: true,
  },
} satisfies ToolExample<PracticalNumberCheckerInput, PracticalNumberCheckerOutput>;

export const practicalNumberCheckerTool = defineTool<PracticalNumberCheckerInput, PracticalNumberCheckerOutput>({
  id: "math/practical-number-checker",
  title: "Practical Number Checker",
  description: "Check whether every integer from one through n is a sum of distinct divisors of n using the Stewart–Sierpiński prime-factor criterion; trial division is limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: practicalNumberCheckerInputSchema,
  outputSchema: practicalNumberCheckerOutputSchema,
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
        id: "isPractical",
        label: "Whether n is practical",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculatePracticalNumberChecker,
});
export const runPracticalNumberChecker = practicalNumberCheckerTool.execute;
export default practicalNumberCheckerTool;
