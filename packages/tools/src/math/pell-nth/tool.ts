import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PellNthInput = {
  readonly n: number;
};
export type PellNthOutput = {
  readonly value: string;
};

export const pellNthInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 10000,
      description: "Zero-indexed term (resource limit 10000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const pellNthOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Pell number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A000129
export const calculatePellNth = (rawInput: unknown): ToolResult<PellNthOutput> => {
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
  if (nValue > 10000)
    return issue("n", "resource_limit", "Value must be at most 10000.");
  const input: PellNthInput = { n: nValue };
  let a = 0n, b = 1n;
  for (let i = 0; i < input.n; i++) [a, b] = [b, 2n * b + a];
  return toolSuccess({ value: a.toString() });
};

export const example = {
  input: {
    n: 10,
  },
  output: {
    value: "2378",
  },
} satisfies ToolExample<PellNthInput, PellNthOutput>;

export const pellNthTool = defineTool<PellNthInput, PellNthOutput>({
  id: "math/pell-nth",
  title: "nth Pell Number",
  description: "Return P(n) exactly with P(0)=0, P(1)=1, and P(n)=2P(n−1)+P(n−2); the index is capped at 10,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: pellNthInputSchema,
  outputSchema: pellNthOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Zero-indexed term (resource limit 10000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Pell number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculatePellNth,
});
export const runPellNth = pellNthTool.execute;
export default pellNthTool;
