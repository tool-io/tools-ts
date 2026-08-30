import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { sievePrimes } from "../chebyshev-theta/tool.js";

export type MertensFunctionInput = {
  readonly n: number;
};
export type MertensFunctionOutput = {
  readonly value: number;
};

export const mertensFunctionInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000000,
      description: "Nonnegative summation limit (sieve resource limit 1000000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const mertensFunctionOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "integer",
      minimum: -1000000,
      maximum: 1000000,
      description: "Mertens summatory Möbius value",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A002321; https://dlmf.nist.gov/27.2
export const calculateMertensFunction = (rawInput: unknown): ToolResult<MertensFunctionOutput> => {
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
  if (nValue > 1000000)
    return issue("n", "resource_limit", "Value must be at most 1000000.");
  const input: MertensFunctionInput = { n: nValue };
  const flags = sievePrimes(input.n);
  const mobius = new Int8Array(input.n + 1).fill(1);
  mobius[0] = 0;
  for (let p = 2; p <= input.n; p++) {
    if (flags[p] !== 1) continue;
    for (let multiple = p; multiple <= input.n; multiple += p) mobius[multiple] = -(mobius[multiple] ?? 0);
    const square = p * p;
    for (let multiple = square; multiple <= input.n; multiple += square) mobius[multiple] = 0;
  }
  let value = 0;
  for (let n = 1; n <= input.n; n++) value += mobius[n] ?? 0;
  return toolSuccess({ value: value === 0 ? 0 : value });
};

export const example = {
  input: {
    n: 10,
  },
  output: {
    value: -1,
  },
} satisfies ToolExample<MertensFunctionInput, MertensFunctionOutput>;

export const mertensFunctionTool = defineTool<MertensFunctionInput, MertensFunctionOutput>({
  id: "math/mertens-function",
  title: "Mertens Function",
  description: "Return M(n)=Σ(k≤n)μ(k) exactly by sieving distinct prime factors and square factors, with M(0)=0 and n capped at 1,000,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: mertensFunctionInputSchema,
  outputSchema: mertensFunctionOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative summation limit (sieve resource limit 1000000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Mertens summatory Möbius value",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateMertensFunction,
});
export const runMertensFunction = mertensFunctionTool.execute;
export default mertensFunctionTool;
