import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type QBinomialCoefficientInput = {
  readonly n: number;
  readonly k: number;
};
export type QBinomialCoefficientOutput = {
  readonly coefficients: ReadonlyArray<string>;
};

export const qBinomialCoefficientInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 64,
      description: "Upper q-binomial index (resource limit 64)",
    },
    k: {
      type: "integer",
      minimum: 0,
      maximum: 64,
      description: "Lower q-binomial index (resource limit 64)",
    },
  },
  required: ["n", "k"],
} as const satisfies ToolJsonSchema;
export const qBinomialCoefficientOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
      },
      description: "Gaussian polynomial coefficients from degree zero upward",
    },
  },
  required: ["coefficients"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/17.2
export const calculateQBinomialCoefficient = (rawInput: unknown): ToolResult<QBinomialCoefficientOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
    readonly k?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n", "k"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "number" || !Number.isSafeInteger(nValue))
    return issue("n", "invalid_type", "Enter a finite safe integer.");
  if (nValue < 0)
    return issue("n", "out_of_range", "Value must be at least 0.");
  if (nValue > 64)
    return issue("n", "resource_limit", "Value must be at most 64.");
  const kValue = candidate.k;
  if (typeof kValue !== "number" || !Number.isSafeInteger(kValue))
    return issue("k", "invalid_type", "Enter a finite safe integer.");
  if (kValue < 0)
    return issue("k", "out_of_range", "Value must be at least 0.");
  if (kValue > 64)
    return issue("k", "resource_limit", "Value must be at most 64.");
  const input: QBinomialCoefficientInput = { n: nValue, k: kValue };
  if (input.k > input.n) return toolSuccess({ coefficients: ["0"] });
  const k = Math.min(input.k, input.n - input.k);
  const rows = Array.from({ length: k + 1 }, (_, index) => index === 0 ? [1n] : [0n]);
  for (let n = 1; n <= input.n; n++) {
    for (let j = Math.min(n, k); j >= 1; j--) {
      const current = rows[j] ?? [0n], previous = rows[j - 1] ?? [0n], shift = n - j;
      const next = Array<bigint>(Math.max(current.length, previous.length + shift)).fill(0n);
      for (let degree = 0; degree < next.length; degree++) next[degree] = (current[degree] ?? 0n) + (degree < shift ? 0n : previous[degree - shift] ?? 0n);
      rows[j] = next;
    }
  }
  return toolSuccess({ coefficients: (rows[k] ?? [0n]).map((value) => value.toString()) });
};

export const example = {
  input: {
    n: 4,
    k: 2,
  },
  output: {
    coefficients: ["1", "1", "2", "1", "1"],
  },
} satisfies ToolExample<QBinomialCoefficientInput, QBinomialCoefficientOutput>;

export const qBinomialCoefficientTool = defineTool<QBinomialCoefficientInput, QBinomialCoefficientOutput>({
  id: "math/q-binomial-coefficient",
  title: "q-Binomial Coefficient Polynomial",
  description: "Return exact coefficients of the Gaussian binomial [n choose k]_q in ascending degree order, with zero for k>n and indices capped at 64.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: qBinomialCoefficientInputSchema,
  outputSchema: qBinomialCoefficientOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Upper q-binomial index (resource limit 64)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "k",
        label: "Lower q-binomial index (resource limit 64)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "coefficients",
        label: "Gaussian polynomial coefficients from degree zero upward",
        valueType: {
          type: "list",
          items: {
            type: "string",
            format: "integer/arbitrary",
          },
        },
      },
    ],
  },
  execute: calculateQBinomialCoefficient,
});
export const runQBinomialCoefficient = qBinomialCoefficientTool.execute;
export default qBinomialCoefficientTool;
