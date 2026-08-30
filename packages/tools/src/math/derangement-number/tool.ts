import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DerangementNumberInput = {
  readonly n: number;
};
export type DerangementNumberOutput = {
  readonly value: string;
};

export const derangementNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 2000,
      description: "Permutation size (resource limit 2000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const derangementNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Derangement count",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const derangement = (n: number): bigint => {
  if (n === 0) return 1n;
  let previous = 1n, current = 0n;
  for (let i = 2; i <= n; i++) [previous, current] = [current, BigInt(i - 1) * (current + previous)];
  return current;
};

// Definition and independently known values: https://oeis.org/A000166
export const calculateDerangementNumber = (rawInput: unknown): ToolResult<DerangementNumberOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "number" || !Number.isSafeInteger(nValue))
    return issue("n", "invalid_type", "Enter a finite safe integer.");
  if (nValue < 0)
    return issue("n", "out_of_range", "Value must be at least 0.");
  if (nValue > 2000)
    return issue("n", "resource_limit", "Value must be at most 2000.");
  const input: DerangementNumberInput = { n: nValue };
  return toolSuccess({ value: derangement(input.n).toString() });
};

export const example = {
  input: {
    n: 6,
  },
  output: {
    value: "265",
  },
} satisfies ToolExample<DerangementNumberInput, DerangementNumberOutput>;

export const derangementNumberTool = defineTool<DerangementNumberInput, DerangementNumberOutput>({
  id: "math/derangement-number",
  title: "Derangement Number",
  description: "Count permutations of n labeled elements with no fixed points exactly, including one empty derangement; n is capped at 2,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: derangementNumberInputSchema,
  outputSchema: derangementNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Permutation size (resource limit 2000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Derangement count",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateDerangementNumber,
});
export const runDerangementNumber = derangementNumberTool.execute;
export default derangementNumberTool;
