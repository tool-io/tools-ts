import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { sievePrimes } from "../chebyshev-theta/tool.js";

export type SieveOfEratosthenesPiInput = {
  readonly n: number;
};
export type SieveOfEratosthenesPiOutput = {
  readonly count: number;
};

export const sieveOfEratosthenesPiInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000000,
      description: "Inclusive prime-counting limit (resource limit 1000000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const sieveOfEratosthenesPiOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: {
      type: "integer",
      minimum: 0,
      maximum: 1000000,
      description: "Number of primes at most n",
    },
  },
  required: ["count"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.2
export const calculateSieveOfEratosthenesPi = (rawInput: unknown): ToolResult<SieveOfEratosthenesPiOutput> => {
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
  if (nValue > 1000000)
    return issue("n", "resource_limit", "Value must be at most 1000000.");
  const input: SieveOfEratosthenesPiInput = { n: nValue };
  const flags = sievePrimes(input.n);
  let count = 0;
  for (let value = 2; value <= input.n; value++) if (flags[value] === 1) count++;
  return toolSuccess({ count });
};

export const example = {
  input: {
    n: 100,
  },
  output: {
    count: 25,
  },
} satisfies ToolExample<SieveOfEratosthenesPiInput, SieveOfEratosthenesPiOutput>;

export const sieveOfEratosthenesPiTool = defineTool<SieveOfEratosthenesPiInput, SieveOfEratosthenesPiOutput>({
  id: "math/sieve-of-eratosthenes-pi",
  title: "Prime Counting by the Sieve of Eratosthenes",
  description: "Count primes at most n exactly with the sieve of Eratosthenes, excluding zero and one and limiting n to 1,000,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sieveOfEratosthenesPiInputSchema,
  outputSchema: sieveOfEratosthenesPiOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Inclusive prime-counting limit (resource limit 1000000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "count",
        label: "Number of primes at most n",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateSieveOfEratosthenesPi,
});
export const runSieveOfEratosthenesPi = sieveOfEratosthenesPiTool.execute;
export default sieveOfEratosthenesPiTool;
