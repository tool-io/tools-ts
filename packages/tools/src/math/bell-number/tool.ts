import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BellNumberInput = {
  readonly n: number;
};
export type BellNumberOutput = {
  readonly value: string;
};

export const bellNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 300,
      description: "Set size (resource limit 300)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const bellNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Bell number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/26.7
export const calculateBellNumber = (rawInput: unknown): ToolResult<BellNumberOutput> => {
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
  if (nValue > 300)
    return issue("n", "resource_limit", "Value must be at most 300.");
  const input: BellNumberInput = { n: nValue };
  let row = [1n];
  for (let i = 1; i <= input.n; i++) {
    const next = [row[row.length - 1] ?? 1n];
    for (let j = 1; j <= i; j++) next.push((next[j - 1] ?? 0n) + (row[j - 1] ?? 0n));
    row = next;
  }
  return toolSuccess({ value: (row[0] ?? 1n).toString() });
};

export const example = {
  input: {
    n: 5,
  },
  output: {
    value: "52",
  },
} satisfies ToolExample<BellNumberInput, BellNumberOutput>;

export const bellNumberTool = defineTool<BellNumberInput, BellNumberOutput>({
  id: "math/bell-number",
  title: "Bell Number",
  description: "Count partitions of an n-element labeled set as an exact decimal integer; n is capped at 300 for bounded computation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: bellNumberInputSchema,
  outputSchema: bellNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Set size (resource limit 300)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Bell number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateBellNumber,
});
export const runBellNumber = bellNumberTool.execute;
export default bellNumberTool;
