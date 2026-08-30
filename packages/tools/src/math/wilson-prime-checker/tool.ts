import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";

export type WilsonPrimeCheckerInput = {
  readonly p: number;
};
export type WilsonPrimeCheckerOutput = {
  readonly isWilson: boolean;
};

export const wilsonPrimeCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: {
      type: "integer",
      minimum: 1,
      maximum: 100000,
      description: "Candidate prime (factorial resource limit 100000)",
    },
  },
  required: ["p"],
} as const satisfies ToolJsonSchema;
export const wilsonPrimeCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isWilson: {
      type: "boolean",
      description: "Whether p is a Wilson prime",
    },
  },
  required: ["isWilson"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A007540
export const calculateWilsonPrimeChecker = (rawInput: unknown): ToolResult<WilsonPrimeCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly p?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["p"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const pValue = candidate.p;
  if (typeof pValue !== "number" || !Number.isSafeInteger(pValue))
    return issue("p", "invalid_type", "Enter a finite safe integer.");
  if (pValue < 1)
    return issue("p", "out_of_range", "Value must be at least 1.");
  if (pValue > 100000)
    return issue("p", "resource_limit", "Value must be at most 100000.");
  const input: WilsonPrimeCheckerInput = { p: pValue };
  if (!isPrimeInteger(input.p)) return toolSuccess({ isWilson: false });
  const p = BigInt(input.p), modulus = p * p;
  let factorial = 1n;
  for (let k = 2n; k < p; k++) factorial = factorial * k % modulus;
  return toolSuccess({ isWilson: (factorial + 1n) % modulus === 0n });
};

export const example = {
  input: {
    p: 13,
  },
  output: {
    isWilson: true,
  },
} satisfies ToolExample<WilsonPrimeCheckerInput, WilsonPrimeCheckerOutput>;

export const wilsonPrimeCheckerTool = defineTool<WilsonPrimeCheckerInput, WilsonPrimeCheckerOutput>({
  id: "math/wilson-prime-checker",
  title: "Wilson Prime Checker",
  description: "Check whether p is prime and (p−1)!+1 is divisible by p², using modular products with a 100,000-factor resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: wilsonPrimeCheckerInputSchema,
  outputSchema: wilsonPrimeCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "p",
        label: "Candidate prime (factorial resource limit 100000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isWilson",
        label: "Whether p is a Wilson prime",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateWilsonPrimeChecker,
});
export const runWilsonPrimeChecker = wilsonPrimeCheckerTool.execute;
export default wilsonPrimeCheckerTool;
