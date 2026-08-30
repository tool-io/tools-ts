import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { extendedEuclid } from "../extended-euclidean-coefficients/tool.js";

export type DedekindSumInput = {
  readonly h: string;
  readonly k: number;
};
export type DedekindSumOutput = {
  readonly numerator: string;
  readonly denominator: string;
  readonly value: number;
};

export const dedekindSumInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    h: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Signed integer multiplier",
    },
    k: {
      type: "integer",
      minimum: 1,
      maximum: 10000,
      description: "Positive denominator (summation resource limit 10000)",
    },
  },
  required: ["h", "k"],
} as const satisfies ToolJsonSchema;
export const dedekindSumOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Reduced Dedekind sum numerator",
    },
    denominator: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Reduced Dedekind sum denominator",
    },
    value: {
      type: "number",
      description: "Dedekind sum value",
    },
  },
  required: ["numerator", "denominator", "value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://doc.sagemath.org/html/en/reference/rings_standard/sage/arith/misc.html#sage.arith.misc.dedekind_sum
export const calculateDedekindSum = (rawInput: unknown): ToolResult<DedekindSumOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly h?: unknown;
    readonly k?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["h", "k"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const hValue = candidate.h;
  if (typeof hValue !== "string")
    return issue("h", "invalid_type", "Enter an integer as a decimal string.");
  if (hValue.length > 200)
    return issue("h", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(hValue))
    return issue("h", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const kValue = candidate.k;
  if (typeof kValue !== "number" || !Number.isSafeInteger(kValue))
    return issue("k", "invalid_type", "Enter a finite safe integer.");
  if (kValue < 1)
    return issue("k", "out_of_range", "Value must be at least 1.");
  if (kValue > 10000)
    return issue("k", "resource_limit", "Value must be at most 10000.");
  const input: DedekindSumInput = { h: hValue, k: kValue };
  const k = BigInt(input.k), h = ((BigInt(input.h) % k) + k) % k;
  let numerator = 0n;
  for (let r = 1n; r < k; r++) {
    const residue = h * r % k;
    if (residue !== 0n) numerator += (2n * r - k) * (2n * residue - k);
  }
  const denominator = 4n * k * k;
  const { gcd } = extendedEuclid(numerator, denominator);
  const reducedNumerator = numerator / gcd, reducedDenominator = denominator / gcd;
  return toolSuccess({ numerator: reducedNumerator.toString(), denominator: reducedDenominator.toString(), value: Number(reducedNumerator) / Number(reducedDenominator) });
};

export const example = {
  input: {
    h: "1",
    k: 5,
  },
  output: {
    numerator: "1",
    denominator: "5",
    value: 0.2,
  },
} satisfies ToolExample<DedekindSumInput, DedekindSumOutput>;

export const dedekindSumTool = defineTool<DedekindSumInput, DedekindSumOutput>({
  id: "math/dedekind-sum",
  title: "Exact Dedekind Sum",
  description: "Compute s(h,k)=Σ(r=1…k−1)((r/k))((hr/k)) as a reduced fraction and finite value, using the zero-at-integers sawtooth convention and k≤10,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dedekindSumInputSchema,
  outputSchema: dedekindSumOutputSchema,
  ports: {
    inputs: [
      {
        id: "h",
        label: "Signed integer multiplier",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "k",
        label: "Positive denominator (summation resource limit 10000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "numerator",
        label: "Reduced Dedekind sum numerator",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "denominator",
        label: "Reduced Dedekind sum denominator",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "value",
        label: "Dedekind sum value",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateDedekindSum,
});
export const runDedekindSum = dedekindSumTool.execute;
export default dedekindSumTool;
