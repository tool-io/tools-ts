import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { binomial } from "../pascal-row/tool.js";

export type FussCatalanNumberInput = {
  readonly n: number;
  readonly arity: number;
};
export type FussCatalanNumberOutput = {
  readonly value: string;
};

export const fussCatalanNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 2500,
      description: "Internal-node count (resource limit 2500)",
    },
    arity: {
      type: "integer",
      minimum: 2,
      maximum: 5000,
      description: "Tree arity p (resource limit 5000)",
    },
  },
  required: ["n", "arity"],
} as const satisfies ToolJsonSchema;
export const fussCatalanNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Fuss–Catalan number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A001764; https://dlmf.nist.gov/26.5
export const calculateFussCatalanNumber = (rawInput: unknown): ToolResult<FussCatalanNumberOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
    readonly arity?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n", "arity"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "number" || !Number.isSafeInteger(nValue))
    return issue("n", "invalid_type", "Enter a finite safe integer.");
  if (nValue < 0)
    return issue("n", "out_of_range", "Value must be at least 0.");
  if (nValue > 2500)
    return issue("n", "resource_limit", "Value must be at most 2500.");
  const arityValue = candidate.arity;
  if (typeof arityValue !== "number" || !Number.isSafeInteger(arityValue))
    return issue("arity", "invalid_type", "Enter a finite safe integer.");
  if (arityValue < 2)
    return issue("arity", "out_of_range", "Value must be at least 2.");
  if (arityValue > 5000)
    return issue("arity", "resource_limit", "Value must be at most 5000.");
  const input: FussCatalanNumberInput = { n: nValue, arity: arityValue };
  const upper = input.arity * input.n;
  if (upper > 5000) return issue("n", "resource_limit", "Arity times node count exceeds 5000.");
  const value = binomial(upper, input.n) / BigInt((input.arity - 1) * input.n + 1);
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 4,
    arity: 3,
  },
  output: {
    value: "55",
  },
} satisfies ToolExample<FussCatalanNumberInput, FussCatalanNumberOutput>;

export const fussCatalanNumberTool = defineTool<FussCatalanNumberInput, FussCatalanNumberOutput>({
  id: "math/fuss-catalan-number",
  title: "Fuss–Catalan Number",
  description: "Return the exact p-ary tree Fuss–Catalan number C(pn,n)/((p−1)n+1), with p≥2 and pn≤5,000 as a computation resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fussCatalanNumberInputSchema,
  outputSchema: fussCatalanNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Internal-node count (resource limit 2500)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "arity",
        label: "Tree arity p (resource limit 5000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Fuss–Catalan number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateFussCatalanNumber,
});
export const runFussCatalanNumber = fussCatalanNumberTool.execute;
export default fussCatalanNumberTool;
