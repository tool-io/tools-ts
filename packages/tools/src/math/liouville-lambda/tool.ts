import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type LiouvilleLambdaInput = {
  readonly n: number;
};
export type LiouvilleLambdaOutput = {
  readonly value: number;
};

export const liouvilleLambdaInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Positive integer (trial-division resource limit 10^12)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const liouvilleLambdaOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "integer",
      enum: [-1, 1],
      description: "Liouville sign",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.2
export const calculateLiouvilleLambda = (rawInput: unknown): ToolResult<LiouvilleLambdaOutput> => {
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
  if (nValue < 1)
    return issue("n", "out_of_range", "Value must be at least 1.");
  if (nValue > 1000000000000)
    return issue("n", "resource_limit", "Value must be at most 1000000000000.");
  const input: LiouvilleLambdaInput = { n: nValue };
  const count = factorPositiveInteger(input.n).reduce((total, factor) => total + factor.exponent, 0);
  return toolSuccess({ value: count % 2 === 0 ? 1 : -1 });
};

export const example = {
  input: {
    n: 72,
  },
  output: {
    value: -1,
  },
} satisfies ToolExample<LiouvilleLambdaInput, LiouvilleLambdaOutput>;

export const liouvilleLambdaTool = defineTool<LiouvilleLambdaInput, LiouvilleLambdaOutput>({
  id: "math/liouville-lambda",
  title: "Liouville Lambda Function",
  description: "Return λ(n)=(−1)^Ω(n), counting prime factors with multiplicity and using λ(1)=1; trial division is limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: liouvilleLambdaInputSchema,
  outputSchema: liouvilleLambdaOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Positive integer (trial-division resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Liouville sign",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateLiouvilleLambda,
});
export const runLiouvilleLambda = liouvilleLambdaTool.execute;
export default liouvilleLambdaTool;
