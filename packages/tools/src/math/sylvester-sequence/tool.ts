import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SylvesterSequenceInput = {
  readonly n: number;
};
export type SylvesterSequenceOutput = {
  readonly value: string;
};

export const sylvesterSequenceInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 15,
      description: "Zero-indexed term (resource limit 15)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const sylvesterSequenceOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Sylvester sequence term",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A000058
export const calculateSylvesterSequence = (rawInput: unknown): ToolResult<SylvesterSequenceOutput> => {
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
  if (nValue > 15)
    return issue("n", "resource_limit", "Value must be at most 15.");
  const input: SylvesterSequenceInput = { n: nValue };
  let value = 2n;
  for (let n = 0; n < input.n; n++) value = value * (value - 1n) + 1n;
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 5,
  },
  output: {
    value: "3263443",
  },
} satisfies ToolExample<SylvesterSequenceInput, SylvesterSequenceOutput>;

export const sylvesterSequenceTool = defineTool<SylvesterSequenceInput, SylvesterSequenceOutput>({
  id: "math/sylvester-sequence",
  title: "Sylvester Sequence Term",
  description: "Return the zero-indexed Sylvester term a(0)=2 and a(n)=a(n−1)(a(n−1)−1)+1 exactly, with an index limit of 15 to bound doubly exponential output growth.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sylvesterSequenceInputSchema,
  outputSchema: sylvesterSequenceOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Zero-indexed term (resource limit 15)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Sylvester sequence term",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateSylvesterSequence,
});
export const runSylvesterSequence = sylvesterSequenceTool.execute;
export default sylvesterSequenceTool;
