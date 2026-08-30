import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { sievePrimes } from "../chebyshev-theta/tool.js";

export type ChebyshevPsiInput = {
  readonly n: number;
};
export type ChebyshevPsiOutput = {
  readonly value: number;
};

export const chebyshevPsiInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000000,
      description: "Nonnegative upper limit (sieve resource limit 1000000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const chebyshevPsiOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      minimum: 0,
      description: "Chebyshev psi using natural logarithms",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://math.mit.edu/classes/18.785/2021fa/LectureNotes16.pdf
export const calculateChebyshevPsi = (rawInput: unknown): ToolResult<ChebyshevPsiOutput> => {
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
  const input: ChebyshevPsiInput = { n: nValue };
  const flags = sievePrimes(input.n);
  let sum = 0, correction = 0;
  for (let p = 2; p <= input.n; p++) {
    if (flags[p] !== 1) continue;
    const log = Math.log(p);
    for (let power = p; power <= input.n; ) {
      const adjusted = log - correction;
      const next = sum + adjusted;
      correction = (next - sum) - adjusted;
      sum = next;
      if (power > input.n / p) break;
      power *= p;
    }
  }
  return toolSuccess({ value: sum });
};

export const example = {
  input: {
    n: 4,
  },
  output: {
    value: 2.484906649788,
  },
} satisfies ToolExample<ChebyshevPsiInput, ChebyshevPsiOutput>;

export const chebyshevPsiTool = defineTool<ChebyshevPsiInput, ChebyshevPsiOutput>({
  id: "math/chebyshev-psi",
  title: "Chebyshev Psi Function",
  description: "Compute ψ(n)=Σ(p^k≤n)ln(p) over all positive prime powers with compensated addition and a prime sieve capped at n=1,000,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: chebyshevPsiInputSchema,
  outputSchema: chebyshevPsiOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative upper limit (sieve resource limit 1000000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Chebyshev psi using natural logarithms",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateChebyshevPsi,
});
export const runChebyshevPsi = chebyshevPsiTool.execute;
export default chebyshevPsiTool;
