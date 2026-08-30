import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { binomial } from "../pascal-row/tool.js";

export type CompositionCountInput = {
  readonly n: number;
  readonly k: number;
};
export type CompositionCountOutput = {
  readonly value: string;
};

export const compositionCountInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 2000,
      description: "Total to compose (resource limit 2000)",
    },
    k: {
      type: "integer",
      minimum: 0,
      maximum: 2000,
      description: "Positive part count (resource limit 2000)",
    },
  },
  required: ["n", "k"],
} as const satisfies ToolJsonSchema;
export const compositionCountOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Composition count",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/26.11
export const calculateCompositionCount = (rawInput: unknown): ToolResult<CompositionCountOutput> => {
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
  if (nValue > 2000)
    return issue("n", "resource_limit", "Value must be at most 2000.");
  const kValue = candidate.k;
  if (typeof kValue !== "number" || !Number.isSafeInteger(kValue))
    return issue("k", "invalid_type", "Enter a finite safe integer.");
  if (kValue < 0)
    return issue("k", "out_of_range", "Value must be at least 0.");
  if (kValue > 2000)
    return issue("k", "resource_limit", "Value must be at most 2000.");
  const input: CompositionCountInput = { n: nValue, k: kValue };
  if (input.n === 0) return toolSuccess({ value: input.k === 0 ? "1" : "0" });
  if (input.k === 0 || input.k > input.n) return toolSuccess({ value: "0" });
  return toolSuccess({ value: binomial(input.n - 1, input.k - 1).toString() });
};

export const example = {
  input: {
    n: 7,
    k: 3,
  },
  output: {
    value: "15",
  },
} satisfies ToolExample<CompositionCountInput, CompositionCountOutput>;

export const compositionCountTool = defineTool<CompositionCountInput, CompositionCountOutput>({
  id: "math/composition-count",
  title: "Composition Count into Positive Parts",
  description: "Count ordered compositions of n into exactly k positive parts, with one empty composition of zero and zero for impossible counts; indices are capped at 2,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: compositionCountInputSchema,
  outputSchema: compositionCountOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Total to compose (resource limit 2000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "k",
        label: "Positive part count (resource limit 2000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Composition count",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateCompositionCount,
});
export const runCompositionCount = compositionCountTool.execute;
export default compositionCountTool;
