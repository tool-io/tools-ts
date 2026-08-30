import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MotzkinNumberInput = {
  readonly n: number;
};
export type MotzkinNumberOutput = {
  readonly value: string;
};

export const motzkinNumberInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000,
      description: "Path length (resource limit 1000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const motzkinNumberOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Motzkin number",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A001006
export const calculateMotzkinNumber = (rawInput: unknown): ToolResult<MotzkinNumberOutput> => {
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
  if (nValue > 1000)
    return issue("n", "resource_limit", "Value must be at most 1000.");
  const input: MotzkinNumberInput = { n: nValue };
  if (input.n < 2) return toolSuccess({ value: "1" });
  let previous = 1n, current = 1n;
  for (let n = 2; n <= input.n; n++) {
    const next = (BigInt(2 * n + 1) * current + 3n * BigInt(n - 1) * previous) / BigInt(n + 2);
    [previous, current] = [current, next];
  }
  return toolSuccess({ value: current.toString() });
};

export const example = {
  input: {
    n: 6,
  },
  output: {
    value: "51",
  },
} satisfies ToolExample<MotzkinNumberInput, MotzkinNumberOutput>;

export const motzkinNumberTool = defineTool<MotzkinNumberInput, MotzkinNumberOutput>({
  id: "math/motzkin-number",
  title: "Motzkin Number",
  description: "Count Motzkin paths of length n exactly, with M(0)=M(1)=1 and a 1,000-index resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: motzkinNumberInputSchema,
  outputSchema: motzkinNumberOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Path length (resource limit 1000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Motzkin number",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateMotzkinNumber,
});
export const runMotzkinNumber = motzkinNumberTool.execute;
export default motzkinNumberTool;
