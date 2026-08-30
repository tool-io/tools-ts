import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type PrimeBigOmegaInput = {
  readonly n: number;
};
export type PrimeBigOmegaOutput = {
  readonly count: number;
};

export const primeBigOmegaInputSchema = {
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
export const primeBigOmegaOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: {
      type: "integer",
      minimum: 0,
      maximum: 64,
      description: "Prime factors counted with multiplicity",
    },
  },
  required: ["count"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.2
export const calculatePrimeBigOmega = (rawInput: unknown): ToolResult<PrimeBigOmegaOutput> => {
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
  const input: PrimeBigOmegaInput = { n: nValue };
  return toolSuccess({ count: factorPositiveInteger(input.n).reduce((total, factor) => total + factor.exponent, 0) });
};

export const example = {
  input: {
    n: 72,
  },
  output: {
    count: 5,
  },
} satisfies ToolExample<PrimeBigOmegaInput, PrimeBigOmegaOutput>;

export const primeBigOmegaTool = defineTool<PrimeBigOmegaInput, PrimeBigOmegaOutput>({
  id: "math/prime-big-omega",
  title: "Prime Factor Count with Multiplicity",
  description: "Return Ω(n), the total number of prime factors counting their exponents, with Ω(1)=0 and trial division limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: primeBigOmegaInputSchema,
  outputSchema: primeBigOmegaOutputSchema,
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
        label: "Prime factors counted with multiplicity",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculatePrimeBigOmega,
});
export const runPrimeBigOmega = primeBigOmegaTool.execute;
export default primeBigOmegaTool;
