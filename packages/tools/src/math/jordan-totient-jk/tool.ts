import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type JordanTotientJkInput = {
  readonly n: number;
  readonly order: number;
};
export type JordanTotientJkOutput = {
  readonly value: string;
};

export const jordanTotientJkInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Positive integer (trial-division resource limit 10^12)",
    },
    order: {
      type: "integer",
      minimum: 1,
      maximum: 128,
      description: "Positive Jordan order (resource limit 128)",
    },
  },
  required: ["n", "order"],
} as const satisfies ToolJsonSchema;
export const jordanTotientJkOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Jordan totient J_k(n)",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.2
export const calculateJordanTotientJk = (rawInput: unknown): ToolResult<JordanTotientJkOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
    readonly order?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n", "order"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "number" || !Number.isSafeInteger(nValue))
    return issue("n", "invalid_type", "Enter a finite safe integer.");
  if (nValue < 1)
    return issue("n", "out_of_range", "Value must be at least 1.");
  if (nValue > 1000000000000)
    return issue("n", "resource_limit", "Value must be at most 1000000000000.");
  const orderValue = candidate.order;
  if (typeof orderValue !== "number" || !Number.isSafeInteger(orderValue))
    return issue("order", "invalid_type", "Enter a finite safe integer.");
  if (orderValue < 1)
    return issue("order", "out_of_range", "Value must be at least 1.");
  if (orderValue > 128)
    return issue("order", "resource_limit", "Value must be at most 128.");
  const input: JordanTotientJkInput = { n: nValue, order: orderValue };
  const k = BigInt(input.order);
  let value = 1n;
  for (const { prime, exponent } of factorPositiveInteger(input.n)) {
    const p = BigInt(prime);
    value *= p ** (k * BigInt(exponent - 1)) * (p ** k - 1n);
  }
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 12,
    order: 2,
  },
  output: {
    value: "96",
  },
} satisfies ToolExample<JordanTotientJkInput, JordanTotientJkOutput>;

export const jordanTotientJkTool = defineTool<JordanTotientJkInput, JordanTotientJkOutput>({
  id: "math/jordan-totient-jk",
  title: "Jordan Totient Function",
  description: "Return J_k(n)=n^k∏(p|n)(1−p^(−k)) exactly for positive order k≤128, with trial division limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: jordanTotientJkInputSchema,
  outputSchema: jordanTotientJkOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Positive integer (trial-division resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "order",
        label: "Positive Jordan order (resource limit 128)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Jordan totient J_k(n)",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateJordanTotientJk,
});
export const runJordanTotientJk = jordanTotientJkTool.execute;
export default jordanTotientJkTool;
