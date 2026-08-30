import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PadovanNthInput = {
  readonly n: number;
};
export type PadovanNthOutput = {
  readonly value: string;
};

export const padovanNthInputSchema = {
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
export const padovanNthOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Padovan number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A000931
export const calculatePadovanNth = (rawInput: unknown): ToolResult<PadovanNthOutput> => {
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
  const input: PadovanNthInput = { n: nValue };
  let a = 1n, b = 1n, c = 1n;
  for (let i = 0; i < input.n; i++) [a, b, c] = [b, c, a + b];
  return toolSuccess({ value: a.toString() });
};

export const example = {
  input: {
    n: 10,
  },
  output: {
    value: "12",
  },
} satisfies ToolExample<PadovanNthInput, PadovanNthOutput>;

export const padovanNthTool = defineTool<PadovanNthInput, PadovanNthOutput>({
  id: "math/padovan-nth",
  title: "nth Padovan Number",
  description: "Return the Padovan sequence with P(0)=P(1)=P(2)=1 and P(n)=P(n−2)+P(n−3) as an exact decimal integer; the index is capped at 10,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: padovanNthInputSchema,
  outputSchema: padovanNthOutputSchema,
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
        label: "Padovan number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculatePadovanNth,
});
export const runPadovanNth = padovanNthTool.execute;
export default padovanNthTool;
