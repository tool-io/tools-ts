import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type PrimeOmegaFunctionInput = {
  readonly n: number;
};
export type PrimeOmegaFunctionOutput = {
  readonly count: number;
};

export const primeOmegaFunctionInputSchema = {
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
export const primeOmegaFunctionOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: {
      type: "integer",
      minimum: 0,
      maximum: 64,
      description: "Number of distinct prime factors",
    },
  },
  required: ["count"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.2
export const calculatePrimeOmegaFunction = (rawInput: unknown): ToolResult<PrimeOmegaFunctionOutput> => {
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
  const input: PrimeOmegaFunctionInput = { n: nValue };
  return toolSuccess({ count: factorPositiveInteger(input.n).length });
};

export const example = {
  input: {
    n: 72,
  },
  output: {
    count: 2,
  },
} satisfies ToolExample<PrimeOmegaFunctionInput, PrimeOmegaFunctionOutput>;

export const primeOmegaFunctionTool = defineTool<PrimeOmegaFunctionInput, PrimeOmegaFunctionOutput>({
  id: "math/prime-omega-function",
  title: "Distinct Prime Factor Count",
  description: "Return ω(n), the number of distinct prime factors, with ω(1)=0 and trial division limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: primeOmegaFunctionInputSchema,
  outputSchema: primeOmegaFunctionOutputSchema,
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
        id: "count",
        label: "Number of distinct prime factors",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculatePrimeOmegaFunction,
});
export const runPrimeOmegaFunction = primeOmegaFunctionTool.execute;
export default primeOmegaFunctionTool;
