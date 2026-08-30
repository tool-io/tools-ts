import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { binomial } from "../pascal-row/tool.js";

export type CatalanTriangleEntryInput = {
  readonly n: number;
  readonly k: number;
};
export type CatalanTriangleEntryOutput = {
  readonly value: string;
};

export const catalanTriangleEntryInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 500,
      description: "Zero-indexed row (resource limit 500)",
    },
    k: {
      type: "integer",
      minimum: 0,
      maximum: 500,
      description: "Zero-indexed column (resource limit 500)",
    },
  },
  required: ["n", "k"],
} as const satisfies ToolJsonSchema;
export const catalanTriangleEntryOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Catalan triangle ballot number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A009766
export const calculateCatalanTriangleEntry = (rawInput: unknown): ToolResult<CatalanTriangleEntryOutput> => {
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
  if (nValue > 500)
    return issue("n", "resource_limit", "Value must be at most 500.");
  const kValue = candidate.k;
  if (typeof kValue !== "number" || !Number.isSafeInteger(kValue))
    return issue("k", "invalid_type", "Enter a finite safe integer.");
  if (kValue < 0)
    return issue("k", "out_of_range", "Value must be at least 0.");
  if (kValue > 500)
    return issue("k", "resource_limit", "Value must be at most 500.");
  const input: CatalanTriangleEntryInput = { n: nValue, k: kValue };
  if (input.k > input.n) return toolSuccess({ value: "0" });
  const value = binomial(input.n + input.k, input.k) - binomial(input.n + input.k, input.k - 1);
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 3,
    k: 2,
  },
  output: {
    value: "5",
  },
} satisfies ToolExample<CatalanTriangleEntryInput, CatalanTriangleEntryOutput>;

export const catalanTriangleEntryTool = defineTool<CatalanTriangleEntryInput, CatalanTriangleEntryOutput>({
  id: "math/catalan-triangle-entry",
  title: "Catalan Triangle Entry",
  description: "Return the ballot-number Catalan triangle entry T(n,k)=C(n+k,k)−C(n+k,k−1), with zero outside 0≤k≤n and indices capped at 500.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: catalanTriangleEntryInputSchema,
  outputSchema: catalanTriangleEntryOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Zero-indexed row (resource limit 500)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "k",
        label: "Zero-indexed column (resource limit 500)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Catalan triangle ballot number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateCatalanTriangleEntry,
});
export const runCatalanTriangleEntry = catalanTriangleEntryTool.execute;
export default catalanTriangleEntryTool;
