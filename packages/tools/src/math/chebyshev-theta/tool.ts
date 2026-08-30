import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ChebyshevThetaInput = {
  readonly n: number;
};
export type ChebyshevThetaOutput = {
  readonly value: number;
};

export const chebyshevThetaInputSchema = {
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
export const chebyshevThetaOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      minimum: 0,
      description: "Chebyshev theta using natural logarithms",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const sievePrimes = (limit: number): Uint8Array => {
  if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1000000) throw new RangeError("Sieve limit must be in 0..1000000.");
  const flags = new Uint8Array(limit + 1).fill(1);
  flags[0] = 0;
  if (limit >= 1) flags[1] = 0;
  for (let p = 2; p <= limit / p; p++) {
    if (flags[p] === 1) for (let multiple = p * p; multiple <= limit; multiple += p) flags[multiple] = 0;
  }
  return flags;
};

// Definition and independently known values: https://math.mit.edu/classes/18.785/2021fa/LectureNotes16.pdf
export const calculateChebyshevTheta = (rawInput: unknown): ToolResult<ChebyshevThetaOutput> => {
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
  const input: ChebyshevThetaInput = { n: nValue };
  const flags = sievePrimes(input.n);
  let sum = 0, correction = 0;
  for (let p = 2; p <= input.n; p++) {
    if (flags[p] !== 1) continue;
    const adjusted = Math.log(p) - correction;
    const next = sum + adjusted;
    correction = (next - sum) - adjusted;
    sum = next;
  }
  return toolSuccess({ value: sum });
};

export const example = {
  input: {
    n: 3,
  },
  output: {
    value: 1.791759469228055,
  },
} satisfies ToolExample<ChebyshevThetaInput, ChebyshevThetaOutput>;

export const chebyshevThetaTool = defineTool<ChebyshevThetaInput, ChebyshevThetaOutput>({
  id: "math/chebyshev-theta",
  title: "Chebyshev Theta Function",
  description: "Compute θ(n)=Σ(p≤n)ln(p) over primes with compensated addition and an exact prime sieve capped at n=1,000,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: chebyshevThetaInputSchema,
  outputSchema: chebyshevThetaOutputSchema,
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
        label: "Chebyshev theta using natural logarithms",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: calculateChebyshevTheta,
});
export const runChebyshevTheta = chebyshevThetaTool.execute;
export default chebyshevThetaTool;
