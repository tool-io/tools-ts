import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type MangoldtLambdaInput = {
  readonly n: number;
};
export type MangoldtLambdaOutput = {
  readonly value: number;
};

export const mangoldtLambdaInputSchema = {
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
export const mangoldtLambdaOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      minimum: 0,
      description: "Von Mangoldt value (natural logarithm)",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.2
export const calculateMangoldtLambda = (rawInput: unknown): ToolResult<MangoldtLambdaOutput> => {
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
  const input: MangoldtLambdaInput = { n: nValue };
  const factors = factorPositiveInteger(input.n);
  const factor = factors[0];
  return toolSuccess({ value: factors.length === 1 && factor !== undefined ? Math.log(factor.prime) : 0 });
};

export const example = {
  input: {
    n: 8,
  },
  output: {
    value: 0.6931471805599453,
  },
} satisfies ToolExample<MangoldtLambdaInput, MangoldtLambdaOutput>;

export const mangoldtLambdaTool = defineTool<MangoldtLambdaInput, MangoldtLambdaOutput>({
  id: "math/mangoldt-lambda",
  title: "Von Mangoldt Lambda Function",
  description: "Return Λ(n)=ln(p) when n is a positive power of a prime p, and zero otherwise, with trial division limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: mangoldtLambdaInputSchema,
  outputSchema: mangoldtLambdaOutputSchema,
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
        label: "Von Mangoldt value (natural logarithm)",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateMangoldtLambda,
});
export const runMangoldtLambda = mangoldtLambdaTool.execute;
export default mangoldtLambdaTool;
