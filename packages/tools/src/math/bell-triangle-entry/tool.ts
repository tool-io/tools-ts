import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BellTriangleEntryInput = {
  readonly n: number;
  readonly k: number;
};
export type BellTriangleEntryOutput = {
  readonly value: string;
};

export const bellTriangleEntryInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 300,
      description: "Zero-indexed row (resource limit 300)",
    },
    k: {
      type: "integer",
      minimum: 0,
      maximum: 300,
      description: "Zero-indexed column (resource limit 300)",
    },
  },
  required: ["n", "k"],
} as const satisfies ToolJsonSchema;
export const bellTriangleEntryOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Aitken Bell triangle entry",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A011971
export const calculateBellTriangleEntry = (rawInput: unknown): ToolResult<BellTriangleEntryOutput> => {
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
  const input: BellTriangleEntryInput = { n: nValue, k: kValue };
  if (input.k > input.n) return issue("k", "invalid_index", "Column must not exceed the row index.");
  let row = [1n];
  for (let i = 1; i <= input.n; i++) {
    const next = [row[row.length - 1] ?? 1n];
    for (let j = 1; j <= i; j++) next.push((next[j - 1] ?? 0n) + (row[j - 1] ?? 0n));
    row = next;
  }
  const value = row[input.k];
  if (value === undefined) throw new Error("Missing Bell triangle entry");
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 3,
    k: 2,
  },
  output: {
    value: "10",
  },
} satisfies ToolExample<BellTriangleEntryInput, BellTriangleEntryOutput>;

export const bellTriangleEntryTool = defineTool<BellTriangleEntryInput, BellTriangleEntryOutput>({
  id: "math/bell-triangle-entry",
  title: "Bell Triangle Entry",
  description: "Return the zero-indexed Aitken Bell triangle entry with row zero [1], each row starting at the previous row’s last entry, and a 300-row resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: bellTriangleEntryInputSchema,
  outputSchema: bellTriangleEntryOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Zero-indexed row (resource limit 300)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "k",
        label: "Zero-indexed column (resource limit 300)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Aitken Bell triangle entry",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateBellTriangleEntry,
});
export const runBellTriangleEntry = bellTriangleEntryTool.execute;
export default bellTriangleEntryTool;
