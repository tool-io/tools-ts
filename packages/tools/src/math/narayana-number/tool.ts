import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { binomial } from "../pascal-row/tool.js";

export type NarayanaNumberInput = {
  readonly n: number;
  readonly k: number;
};
export type NarayanaNumberOutput = {
  readonly value: string;
};

export const narayanaNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 500,
      description: "Dyck path semilength (resource limit 500)",
    },
    k: {
      type: "integer",
      minimum: 0,
      maximum: 500,
      description: "Peak count (resource limit 500)",
    },
  },
  required: ["n", "k"],
} as const satisfies ToolJsonSchema;
export const narayanaNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Narayana number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A001263
export const calculateNarayanaNumber = (rawInput: unknown): ToolResult<NarayanaNumberOutput> => {
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
  const input: NarayanaNumberInput = { n: nValue, k: kValue };
  if (input.n === 0) return toolSuccess({ value: input.k === 0 ? "1" : "0" });
  if (input.k === 0 || input.k > input.n) return toolSuccess({ value: "0" });
  const value = binomial(input.n, input.k) * binomial(input.n, input.k - 1) / BigInt(input.n);
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 5,
    k: 3,
  },
  output: {
    value: "20",
  },
} satisfies ToolExample<NarayanaNumberInput, NarayanaNumberOutput>;

export const narayanaNumberTool = defineTool<NarayanaNumberInput, NarayanaNumberOutput>({
  id: "math/narayana-number",
  title: "Narayana Number",
  description: "Count Dyck paths of semilength n with k peaks as an exact Narayana number, using N(0,0)=1 and zero outside the counting range; indices are capped at 500.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: narayanaNumberInputSchema,
  outputSchema: narayanaNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Dyck path semilength (resource limit 500)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "k",
        label: "Peak count (resource limit 500)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Narayana number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateNarayanaNumber,
});
export const runNarayanaNumber = narayanaNumberTool.execute;
export default narayanaNumberTool;
