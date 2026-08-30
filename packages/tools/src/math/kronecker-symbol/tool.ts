import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { jacobiSymbol } from "../jacobi-symbol/tool.js";

export type KroneckerSymbolInput = {
  readonly numerator: string;
  readonly denominator: string;
};
export type KroneckerSymbolOutput = {
  readonly symbol: number;
};

export const kroneckerSymbolInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Signed integer numerator",
    },
    denominator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Signed integer denominator",
    },
  },
  required: ["numerator", "denominator"],
} as const satisfies ToolJsonSchema;
export const kroneckerSymbolOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbol: {
      type: "integer",
      enum: [-1, 0, 1],
      description: "Kronecker symbol",
    },
  },
  required: ["symbol"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://doc.sagemath.org/html/en/reference/rings_standard/sage/arith/misc.html#sage.arith.misc.kronecker_symbol
export const calculateKroneckerSymbol = (rawInput: unknown): ToolResult<KroneckerSymbolOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly numerator?: unknown;
    readonly denominator?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["numerator", "denominator"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const numeratorValue = candidate.numerator;
  if (typeof numeratorValue !== "string")
    return issue("numerator", "invalid_type", "Enter an integer as a decimal string.");
  if (numeratorValue.length > 200)
    return issue("numerator", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(numeratorValue))
    return issue("numerator", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const denominatorValue = candidate.denominator;
  if (typeof denominatorValue !== "string")
    return issue("denominator", "invalid_type", "Enter an integer as a decimal string.");
  if (denominatorValue.length > 200)
    return issue("denominator", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(denominatorValue))
    return issue("denominator", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: KroneckerSymbolInput = { numerator: numeratorValue, denominator: denominatorValue };
  const a = BigInt(input.numerator);
  let oddDenominator = BigInt(input.denominator);
  if (oddDenominator === 0n) return toolSuccess({ symbol: a === 1n || a === -1n ? 1 : 0 });
  let sign = 1;
  if (oddDenominator < 0n) { oddDenominator = -oddDenominator; if (a < 0n) sign = -sign; }
  let twos = 0;
  while (oddDenominator % 2n === 0n) { oddDenominator /= 2n; twos++; }
  if (twos > 0) {
    if (a % 2n === 0n) return toolSuccess({ symbol: 0 });
    const residue = ((a % 8n) + 8n) % 8n;
    if (twos % 2 === 1 && (residue === 3n || residue === 5n)) sign = -sign;
  }
  const symbol = sign * jacobiSymbol(a, oddDenominator);
  return toolSuccess({ symbol: symbol === 0 ? 0 : symbol });
};

export const example = {
  input: {
    numerator: "3",
    denominator: "8",
  },
  output: {
    symbol: -1,
  },
} satisfies ToolExample<KroneckerSymbolInput, KroneckerSymbolOutput>;

export const kroneckerSymbolTool = defineTool<KroneckerSymbolInput, KroneckerSymbolOutput>({
  id: "math/kronecker-symbol",
  title: "Kronecker Symbol",
  description: "Extend the Jacobi symbol to signed decimal denominators, including factors of two, negative denominators, and (a/0)=1 exactly when |a|=1.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: kroneckerSymbolInputSchema,
  outputSchema: kroneckerSymbolOutputSchema,
  ports: {
    inputs: [
      {
        id: "numerator",
        label: "Signed integer numerator",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "denominator",
        label: "Signed integer denominator",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "symbol",
        label: "Kronecker symbol",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateKroneckerSymbol,
});
export const runKroneckerSymbol = kroneckerSymbolTool.execute;
export default kroneckerSymbolTool;
