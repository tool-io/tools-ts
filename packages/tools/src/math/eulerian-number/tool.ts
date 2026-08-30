import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type EulerianNumberInput = {
  readonly n: number;
  readonly k: number;
};
export type EulerianNumberOutput = {
  readonly value: string;
};

export const eulerianNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 300,
      description: "Permutation size (resource limit 300)",
    },
    k: {
      type: "integer",
      minimum: 0,
      maximum: 300,
      description: "Ascent count (resource limit 300)",
    },
  },
  required: ["n", "k"],
} as const satisfies ToolJsonSchema;
export const eulerianNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Eulerian number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/26.14
export const calculateEulerianNumber = (rawInput: unknown): ToolResult<EulerianNumberOutput> => {
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
  if (nValue > 300)
    return issue("n", "resource_limit", "Value must be at most 300.");
  const kValue = candidate.k;
  if (typeof kValue !== "number" || !Number.isSafeInteger(kValue))
    return issue("k", "invalid_type", "Enter a finite safe integer.");
  if (kValue < 0)
    return issue("k", "out_of_range", "Value must be at least 0.");
  if (kValue > 300)
    return issue("k", "resource_limit", "Value must be at most 300.");
  const input: EulerianNumberInput = { n: nValue, k: kValue };
  if (input.n === 0) return toolSuccess({ value: input.k === 0 ? "1" : "0" });
  if (input.k >= input.n) return toolSuccess({ value: "0" });
  const row = Array<bigint>(input.k + 1).fill(0n);
  row[0] = 1n;
  for (let i = 1; i <= input.n; i++) {
    for (let j = Math.min(input.k, i - 1); j >= 0; j--) row[j] = BigInt(i - j) * (j === 0 ? 0n : row[j - 1] ?? 0n) + BigInt(j + 1) * (row[j] ?? 0n);
  }
  return toolSuccess({ value: (row[input.k] ?? 0n).toString() });
};

export const example = {
  input: {
    n: 4,
    k: 1,
  },
  output: {
    value: "11",
  },
} satisfies ToolExample<EulerianNumberInput, EulerianNumberOutput>;

export const eulerianNumberTool = defineTool<EulerianNumberInput, EulerianNumberOutput>({
  id: "math/eulerian-number",
  title: "Eulerian Number",
  description: "Count permutations of n labeled elements with exactly k ascents, using A(0,0)=1 and zero outside the counting range; indices are capped at 300.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: eulerianNumberInputSchema,
  outputSchema: eulerianNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Permutation size (resource limit 300)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "k",
        label: "Ascent count (resource limit 300)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Eulerian number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateEulerianNumber,
});
export const runEulerianNumber = eulerianNumberTool.execute;
export default eulerianNumberTool;
