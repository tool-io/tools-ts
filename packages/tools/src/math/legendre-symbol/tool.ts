import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";
import { modularPower } from "../pseudoprime-base2-checker/tool.js";

export type LegendreSymbolInput = {
  readonly numerator: string;
  readonly prime: number;
};
export type LegendreSymbolOutput = {
  readonly symbol: number;
};

export const legendreSymbolInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Signed integer a",
    },
    prime: {
      type: "integer",
      minimum: 3,
      maximum: 1000000000000,
      description: "Odd prime modulus (resource limit 10^12)",
    },
  },
  required: ["numerator", "prime"],
} as const satisfies ToolJsonSchema;
export const legendreSymbolOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbol: {
      type: "integer",
      enum: [-1, 0, 1],
      description: "Legendre symbol",
    },
  },
  required: ["symbol"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://doc.sagemath.org/html/en/reference/rings_standard/sage/arith/misc.html#sage.arith.misc.legendre_symbol
export const calculateLegendreSymbol = (rawInput: unknown): ToolResult<LegendreSymbolOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly numerator?: unknown;
    readonly prime?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["numerator", "prime"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const numeratorValue = candidate.numerator;
  if (typeof numeratorValue !== "string")
    return issue("numerator", "invalid_type", "Enter an integer as a decimal string.");
  if (numeratorValue.length > 200)
    return issue("numerator", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(numeratorValue))
    return issue("numerator", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const primeValue = candidate.prime;
  if (typeof primeValue !== "number" || !Number.isSafeInteger(primeValue))
    return issue("prime", "invalid_type", "Enter a finite safe integer.");
  if (primeValue < 3)
    return issue("prime", "out_of_range", "Value must be at least 3.");
  if (primeValue > 1000000000000)
    return issue("prime", "resource_limit", "Value must be at most 1000000000000.");
  const input: LegendreSymbolInput = { numerator: numeratorValue, prime: primeValue };
  if (input.prime % 2 === 0 || !isPrimeInteger(input.prime)) return issue("prime", "not_odd_prime", "Modulus must be an odd prime.");
  const p = BigInt(input.prime), a = ((BigInt(input.numerator) % p) + p) % p;
  const residue = modularPower(a, (p - 1n) / 2n, p);
  return toolSuccess({ symbol: residue === 0n ? 0 : residue === 1n ? 1 : -1 });
};

export const example = {
  input: {
    numerator: "5",
    prime: 11,
  },
  output: {
    symbol: 1,
  },
} satisfies ToolExample<LegendreSymbolInput, LegendreSymbolOutput>;

export const legendreSymbolTool = defineTool<LegendreSymbolInput, LegendreSymbolOutput>({
  id: "math/legendre-symbol",
  title: "Legendre Symbol",
  description: "Return the Legendre symbol (a/p) for a signed decimal integer and an odd prime p, using Euler’s criterion and trial primality testing limited to p≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: legendreSymbolInputSchema,
  outputSchema: legendreSymbolOutputSchema,
  ports: {
    inputs: [
      {
        id: "numerator",
        label: "Signed integer a",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "prime",
        label: "Odd prime modulus (resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "symbol",
        label: "Legendre symbol",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateLegendreSymbol,
});
export const runLegendreSymbol = legendreSymbolTool.execute;
export default legendreSymbolTool;
