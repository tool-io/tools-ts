import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { binomial } from "../pascal-row/tool.js";
import { derangement } from "../derangement-number/tool.js";

export type RencontresNumberInput = {
  readonly n: number;
  readonly k: number;
};
export type RencontresNumberOutput = {
  readonly value: string;
};

export const rencontresNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000,
      description: "Permutation size (resource limit 1000)",
    },
    k: {
      type: "integer",
      minimum: 0,
      maximum: 1000,
      description: "Exact fixed-point count (resource limit 1000)",
    },
  },
  required: ["n", "k"],
} as const satisfies ToolJsonSchema;
export const rencontresNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Rencontres count",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A008290
export const calculateRencontresNumber = (rawInput: unknown): ToolResult<RencontresNumberOutput> => {
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
  if (nValue > 1000)
    return issue("n", "resource_limit", "Value must be at most 1000.");
  const kValue = candidate.k;
  if (typeof kValue !== "number" || !Number.isSafeInteger(kValue))
    return issue("k", "invalid_type", "Enter a finite safe integer.");
  if (kValue < 0)
    return issue("k", "out_of_range", "Value must be at least 0.");
  if (kValue > 1000)
    return issue("k", "resource_limit", "Value must be at most 1000.");
  const input: RencontresNumberInput = { n: nValue, k: kValue };
  if (input.k > input.n) return toolSuccess({ value: "0" });
  return toolSuccess({ value: (binomial(input.n, input.k) * derangement(input.n - input.k)).toString() });
};

export const example = {
  input: {
    n: 5,
    k: 2,
  },
  output: {
    value: "20",
  },
} satisfies ToolExample<RencontresNumberInput, RencontresNumberOutput>;

export const rencontresNumberTool = defineTool<RencontresNumberInput, RencontresNumberOutput>({
  id: "math/rencontres-number",
  title: "Rencontres Number",
  description: "Count permutations of n labeled elements with exactly k fixed points using C(n,k)·D(n−k), returning zero for k>n; indices are capped at 1,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: rencontresNumberInputSchema,
  outputSchema: rencontresNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Permutation size (resource limit 1000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "k",
        label: "Exact fixed-point count (resource limit 1000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Rencontres count",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateRencontresNumber,
});
export const runRencontresNumber = rencontresNumberTool.execute;
export default rencontresNumberTool;
