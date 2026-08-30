import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { sievePrimes } from "../chebyshev-theta/tool.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";

export type TwinPrimeCountingPi2Input = {
  readonly n: number;
};
export type TwinPrimeCountingPi2Output = {
  readonly count: number;
};

export const twinPrimeCountingPi2InputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000000,
      description: "Inclusive limit on the smaller prime (resource limit 1000000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const twinPrimeCountingPi2OutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: {
      type: "integer",
      minimum: 0,
      maximum: 1000000,
      description: "Twin-prime pairs with smaller prime at most n",
    },
  },
  required: ["count"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A001359
export const calculateTwinPrimeCountingPi2 = (rawInput: unknown): ToolResult<TwinPrimeCountingPi2Output> => {
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
  const input: TwinPrimeCountingPi2Input = { n: nValue };
  const flags = sievePrimes(input.n);
  let count = 0;
  for (let p = 2; p <= input.n; p++) {
    if (flags[p] === 1 && (p + 2 <= input.n ? flags[p + 2] === 1 : isPrimeInteger(p + 2))) count++;
  }
  return toolSuccess({ count });
};

export const example = {
  input: {
    n: 100,
  },
  output: {
    count: 8,
  },
} satisfies ToolExample<TwinPrimeCountingPi2Input, TwinPrimeCountingPi2Output>;

export const twinPrimeCountingPi2Tool = defineTool<TwinPrimeCountingPi2Input, TwinPrimeCountingPi2Output>({
  id: "math/twin-prime-counting-pi2",
  title: "Twin Prime Counting Function",
  description: "Count twin-prime pairs whose smaller prime is at most n, testing the upper member even when it exceeds n; the sieve limit is capped at 1,000,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: twinPrimeCountingPi2InputSchema,
  outputSchema: twinPrimeCountingPi2OutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Inclusive limit on the smaller prime (resource limit 1000000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "count",
        label: "Twin-prime pairs with smaller prime at most n",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateTwinPrimeCountingPi2,
});
export const runTwinPrimeCountingPi2 = twinPrimeCountingPi2Tool.execute;
export default twinPrimeCountingPi2Tool;
