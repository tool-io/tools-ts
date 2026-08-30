import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";
import { modularPower } from "../pseudoprime-base2-checker/tool.js";

export type BinomialCoefficientModPrimeLucasInput = {
  readonly n: string;
  readonly k: string;
  readonly prime: number;
};
export type BinomialCoefficientModPrimeLucasOutput = {
  readonly residue: number;
};

export const binomialCoefficientModPrimeLucasInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Nonnegative upper binomial index",
    },
    k: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Nonnegative lower binomial index",
    },
    prime: {
      type: "integer",
      minimum: 2,
      maximum: 10000,
      description: "Prime modulus (resource limit 10000)",
    },
  },
  required: ["n", "k", "prime"],
} as const satisfies ToolJsonSchema;
export const binomialCoefficientModPrimeLucasOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residue: {
      type: "integer",
      minimum: 0,
      maximum: 9999,
      description: "Binomial coefficient modulo the prime",
    },
  },
  required: ["residue"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/26.3; https://math.hmc.edu/funfacts/lucas-theorem/
export const calculateBinomialCoefficientModPrimeLucas = (rawInput: unknown): ToolResult<BinomialCoefficientModPrimeLucasOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
    readonly k?: unknown;
    readonly prime?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n", "k", "prime"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "string")
    return issue("n", "invalid_type", "Enter an integer as a decimal string.");
  if (nValue.length > 200)
    return issue("n", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(nValue))
    return issue("n", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const kValue = candidate.k;
  if (typeof kValue !== "string")
    return issue("k", "invalid_type", "Enter an integer as a decimal string.");
  if (kValue.length > 200)
    return issue("k", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(kValue))
    return issue("k", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const primeValue = candidate.prime;
  if (typeof primeValue !== "number" || !Number.isSafeInteger(primeValue))
    return issue("prime", "invalid_type", "Enter a finite safe integer.");
  if (primeValue < 2)
    return issue("prime", "out_of_range", "Value must be at least 2.");
  if (primeValue > 10000)
    return issue("prime", "resource_limit", "Value must be at most 10000.");
  const input: BinomialCoefficientModPrimeLucasInput = { n: nValue, k: kValue, prime: primeValue };
  if (!isPrimeInteger(input.prime)) return issue("prime", "not_prime", "Modulus must be prime.");
  let n = BigInt(input.n), k = BigInt(input.k);
  const p = BigInt(input.prime);
  let result = 1n;
  while (n > 0n || k > 0n) {
    const a = n % p, b = k % p;
    if (b > a) return toolSuccess({ residue: 0 });
    const width = b < a - b ? b : a - b;
    let numerator = 1n, denominator = 1n;
    for (let i = 1n; i <= width; i++) {
      numerator = numerator * (a - width + i) % p;
      denominator = denominator * i % p;
    }
    result = result * numerator % p * modularPower(denominator, p - 2n, p) % p;
    n /= p; k /= p;
  }
  return toolSuccess({ residue: Number(result) });
};

export const example = {
  input: {
    n: "100",
    k: "50",
    prime: 7,
  },
  output: {
    residue: 4,
  },
} satisfies ToolExample<BinomialCoefficientModPrimeLucasInput, BinomialCoefficientModPrimeLucasOutput>;

export const binomialCoefficientModPrimeLucasTool = defineTool<BinomialCoefficientModPrimeLucasInput, BinomialCoefficientModPrimeLucasOutput>({
  id: "math/binomial-coefficient-mod-prime-lucas",
  title: "Binomial Coefficient Modulo a Prime by Lucas’s Theorem",
  description: "Compute C(n,k) modulo a prime from the base-prime digits of exact nonnegative decimal integers; the prime is capped at 10,000 for bounded work.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: binomialCoefficientModPrimeLucasInputSchema,
  outputSchema: binomialCoefficientModPrimeLucasOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative upper binomial index",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "k",
        label: "Nonnegative lower binomial index",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "prime",
        label: "Prime modulus (resource limit 10000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "residue",
        label: "Binomial coefficient modulo the prime",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateBinomialCoefficientModPrimeLucas,
});
export const runBinomialCoefficientModPrimeLucas = binomialCoefficientModPrimeLucasTool.execute;
export default binomialCoefficientModPrimeLucasTool;
