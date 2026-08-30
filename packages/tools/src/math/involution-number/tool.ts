import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type InvolutionNumberInput = {
  readonly n: number;
};
export type InvolutionNumberOutput = {
  readonly value: string;
};

export const involutionNumberInputSchema = {
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
export const involutionNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Involution count",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A000085
export const calculateInvolutionNumber = (rawInput: unknown): ToolResult<InvolutionNumberOutput> => {
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
  const input: InvolutionNumberInput = { n: nValue };
  let previous = 1n, current = 1n;
  for (let n = 2; n <= input.n; n++) [previous, current] = [current, current + BigInt(n - 1) * previous];
  return toolSuccess({ value: current.toString() });
};

export const example = {
  input: {
    n: 6,
  },
  output: {
    value: "76",
  },
} satisfies ToolExample<InvolutionNumberInput, InvolutionNumberOutput>;

export const involutionNumberTool = defineTool<InvolutionNumberInput, InvolutionNumberOutput>({
  id: "math/involution-number",
  title: "Involution Number",
  description: "Count permutations of n labeled elements consisting only of fixed points and transpositions exactly, including the empty involution; n is capped at 2,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: involutionNumberInputSchema,
  outputSchema: involutionNumberOutputSchema,
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
        label: "Involution count",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateInvolutionNumber,
});
export const runInvolutionNumber = involutionNumberTool.execute;
export default involutionNumberTool;
