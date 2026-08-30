import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type RecamanSequenceNthInput = {
  readonly n: number;
};
export type RecamanSequenceNthOutput = {
  readonly value: number;
};

export const recamanSequenceNthInputSchema = {
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
export const recamanSequenceNthOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "integer",
      minimum: 0,
      maximum: 5000050000,
      description: "Recamán sequence term",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A005132
export const calculateRecamanSequenceNth = (rawInput: unknown): ToolResult<RecamanSequenceNthOutput> => {
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
  const input: RecamanSequenceNthInput = { n: nValue };
  let value = 0;
  const used = new Set<number>([0]);
  for (let step = 1; step <= input.n; step++) {
    const candidate = value - step;
    value = candidate > 0 && !used.has(candidate) ? candidate : value + step;
    used.add(value);
  }
  return toolSuccess({ value });
};

export const example = {
  input: {
    n: 10,
  },
  output: {
    value: 11,
  },
} satisfies ToolExample<RecamanSequenceNthInput, RecamanSequenceNthOutput>;

export const recamanSequenceNthTool = defineTool<RecamanSequenceNthInput, RecamanSequenceNthOutput>({
  id: "math/recaman-sequence-nth",
  title: "Recamán Sequence Term",
  description: "Return a(0)=0 and a(n)=a(n−1)−n when that value is positive and unused, otherwise a(n−1)+n; the index is capped at 100,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: recamanSequenceNthInputSchema,
  outputSchema: recamanSequenceNthOutputSchema,
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
        label: "Recamán sequence term",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateRecamanSequenceNth,
});
export const runRecamanSequenceNth = recamanSequenceNthTool.execute;
export default recamanSequenceNthTool;
