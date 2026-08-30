import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type LucasNthInput = {
  readonly n: number;
};
export type LucasNthOutput = {
  readonly value: string;
};

export const lucasNthInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 100000,
      description: "Zero-indexed term (resource limit 100000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const lucasNthOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Lucas number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A000032
export const calculateLucasNth = (rawInput: unknown): ToolResult<LucasNthOutput> => {
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
  if (nValue > 100000)
    return issue("n", "resource_limit", "Value must be at most 100000.");
  const input: LucasNthInput = { n: nValue };
  let a = 2n, b = 1n;
  for (let i = 0; i < input.n; i++) [a, b] = [b, a + b];
  return toolSuccess({ value: a.toString() });
};

export const example = {
  input: {
    n: 20,
  },
  output: {
    value: "15127",
  },
} satisfies ToolExample<LucasNthInput, LucasNthOutput>;

export const lucasNthTool = defineTool<LucasNthInput, LucasNthOutput>({
  id: "math/lucas-nth",
  title: "nth Lucas Number",
  description: "Return L(n) exactly as a decimal string with L(0)=2 and L(1)=1; the index is capped at 100,000 for bounded computation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: lucasNthInputSchema,
  outputSchema: lucasNthOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Zero-indexed term (resource limit 100000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Lucas number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateLucasNth,
});
export const runLucasNth = lucasNthTool.execute;
export default lucasNthTool;
