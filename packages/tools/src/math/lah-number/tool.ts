import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { binomial } from "../pascal-row/tool.js";

export type LahNumberInput = {
  readonly n: number;
  readonly k: number;
};
export type LahNumberOutput = {
  readonly value: string;
};

export const lahNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 500,
      description: "Labeled element count (resource limit 500)",
    },
    k: {
      type: "integer",
      minimum: 0,
      maximum: 500,
      description: "Ordered block count (resource limit 500)",
    },
  },
  required: ["n", "k"],
} as const satisfies ToolJsonSchema;
export const lahNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Unsigned Lah number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A105278
export const calculateLahNumber = (rawInput: unknown): ToolResult<LahNumberOutput> => {
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
  const input: LahNumberInput = { n: nValue, k: kValue };
  if (input.n === 0) return toolSuccess({ value: input.k === 0 ? "1" : "0" });
  if (input.k === 0 || input.k > input.n) return toolSuccess({ value: "0" });
  let value = binomial(input.n - 1, input.k - 1);
  for (let i = input.k + 1; i <= input.n; i++) value *= BigInt(i);
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 4,
    k: 2,
  },
  output: {
    value: "36",
  },
} satisfies ToolExample<LahNumberInput, LahNumberOutput>;

export const lahNumberTool = defineTool<LahNumberInput, LahNumberOutput>({
  id: "math/lah-number",
  title: "Unsigned Lah Number",
  description: "Count partitions of n labeled elements into k nonempty linearly ordered blocks using unsigned Lah numbers, including L(0,0)=1; indices are capped at 500.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: lahNumberInputSchema,
  outputSchema: lahNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Labeled element count (resource limit 500)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "k",
        label: "Ordered block count (resource limit 500)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Unsigned Lah number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateLahNumber,
});
export const runLahNumber = lahNumberTool.execute;
export default lahNumberTool;
