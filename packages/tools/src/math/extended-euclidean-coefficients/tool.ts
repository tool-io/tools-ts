import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ExtendedEuclideanCoefficientsInput = {
  readonly a: string;
  readonly b: string;
};
export type ExtendedEuclideanCoefficientsOutput = {
  readonly gcd: string;
  readonly x: string;
  readonly y: string;
};

export const extendedEuclideanCoefficientsInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "First signed integer",
    },
    b: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Second signed integer",
    },
  },
  required: ["a", "b"],
} as const satisfies ToolJsonSchema;
export const extendedEuclideanCoefficientsOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gcd: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Greatest common divisor",
    },
    x: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Coefficient of a",
    },
    y: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Coefficient of b",
    },
  },
  required: ["gcd", "x", "y"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const extendedEuclid = (first: bigint, second: bigint): Readonly<{ gcd: bigint; x: bigint; y: bigint }> => {
  let a = first < 0n ? -first : first, b = second < 0n ? -second : second;
  let x = 1n, nextX = 0n, y = 0n, nextY = 1n;
  while (b !== 0n) {
    const quotient = a / b;
    [a, b] = [b, a - quotient * b];
    [x, nextX] = [nextX, x - quotient * nextX];
    [y, nextY] = [nextY, y - quotient * nextY];
  }
  return { gcd: a, x: first < 0n ? -x : x, y: second < 0n ? -y : y };
};

// Definition and independently known values: https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_(Raji)/01%3A_Introduction/1.06%3A_The_Euclidean_Algorithm
export const calculateExtendedEuclideanCoefficients = (rawInput: unknown): ToolResult<ExtendedEuclideanCoefficientsOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly a?: unknown;
    readonly b?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["a", "b"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const aValue = candidate.a;
  if (typeof aValue !== "string")
    return issue("a", "invalid_type", "Enter an integer as a decimal string.");
  if (aValue.length > 200)
    return issue("a", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(aValue))
    return issue("a", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const bValue = candidate.b;
  if (typeof bValue !== "string")
    return issue("b", "invalid_type", "Enter an integer as a decimal string.");
  if (bValue.length > 200)
    return issue("b", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(bValue))
    return issue("b", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: ExtendedEuclideanCoefficientsInput = { a: aValue, b: bValue };
  const result = extendedEuclid(BigInt(input.a), BigInt(input.b));
  return toolSuccess({ gcd: result.gcd.toString(), x: result.x.toString(), y: result.y.toString() });
};

export const example = {
  input: {
    a: "240",
    b: "46",
  },
  output: {
    gcd: "2",
    x: "-9",
    y: "47",
  },
} satisfies ToolExample<ExtendedEuclideanCoefficientsInput, ExtendedEuclideanCoefficientsOutput>;

export const extendedEuclideanCoefficientsTool = defineTool<ExtendedEuclideanCoefficientsInput, ExtendedEuclideanCoefficientsOutput>({
  id: "math/extended-euclidean-coefficients",
  title: "Extended Euclidean Coefficients",
  description: "Find exact decimal coefficients x and y satisfying a·x+b·y=gcd(a,b), with a nonnegative gcd and deterministic coefficients even when both inputs are zero.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: extendedEuclideanCoefficientsInputSchema,
  outputSchema: extendedEuclideanCoefficientsOutputSchema,
  ports: {
    inputs: [
      {
        id: "a",
        label: "First signed integer",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "b",
        label: "Second signed integer",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "gcd",
        label: "Greatest common divisor",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "x",
        label: "Coefficient of a",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "y",
        label: "Coefficient of b",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateExtendedEuclideanCoefficients,
});
export const runExtendedEuclideanCoefficients = extendedEuclideanCoefficientsTool.execute;
export default extendedEuclideanCoefficientsTool;
