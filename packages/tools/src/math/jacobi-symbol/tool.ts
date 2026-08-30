import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type JacobiSymbolInput = {
  readonly numerator: string;
  readonly denominator: string;
};
export type JacobiSymbolOutput = {
  readonly symbol: number;
};

export const jacobiSymbolInputSchema = {
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
      pattern: "^[1-9][0-9]*$",
      maxLength: 200,
      description: "Positive odd denominator",
    },
  },
  required: ["numerator", "denominator"],
} as const satisfies ToolJsonSchema;
export const jacobiSymbolOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbol: {
      type: "integer",
      enum: [-1, 0, 1],
      description: "Jacobi symbol",
    },
  },
  required: ["symbol"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const jacobiSymbol = (numerator: bigint, denominator: bigint): number => {
  if (denominator < 1n || denominator % 2n === 0n) throw new RangeError("Jacobi denominator must be positive and odd.");
  let a = ((numerator % denominator) + denominator) % denominator, n = denominator, sign = 1;
  while (a !== 0n) {
    while (a % 2n === 0n) {
      a /= 2n;
      const residue = n % 8n;
      if (residue === 3n || residue === 5n) sign = -sign;
    }
    [a, n] = [n, a];
    if (a % 4n === 3n && n % 4n === 3n) sign = -sign;
    a %= n;
  }
  return n === 1n ? sign : 0;
};

// Definition and independently known values: https://doc.sagemath.org/html/en/reference/rings_standard/sage/arith/misc.html#sage.arith.misc.jacobi_symbol
export const calculateJacobiSymbol = (rawInput: unknown): ToolResult<JacobiSymbolOutput> => {
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
  if (!/^[1-9][0-9]*$/.test(denominatorValue))
    return issue("denominator", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: JacobiSymbolInput = { numerator: numeratorValue, denominator: denominatorValue };
  const denominator = BigInt(input.denominator);
  if (denominator % 2n === 0n) return issue("denominator", "invalid_modulus", "Jacobi denominator must be odd.");
  return toolSuccess({ symbol: jacobiSymbol(BigInt(input.numerator), denominator) });
};

export const example = {
  input: {
    numerator: "5",
    denominator: "21",
  },
  output: {
    symbol: 1,
  },
} satisfies ToolExample<JacobiSymbolInput, JacobiSymbolOutput>;

export const jacobiSymbolTool = defineTool<JacobiSymbolInput, JacobiSymbolOutput>({
  id: "math/jacobi-symbol",
  title: "Jacobi Symbol",
  description: "Return (a/n) for a signed decimal numerator and positive odd decimal denominator, including (a/1)=1; a value of one does not prove a quadratic residue for composite n.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: jacobiSymbolInputSchema,
  outputSchema: jacobiSymbolOutputSchema,
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
        label: "Positive odd denominator",
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
        label: "Jacobi symbol",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateJacobiSymbol,
});
export const runJacobiSymbol = jacobiSymbolTool.execute;
export default jacobiSymbolTool;
