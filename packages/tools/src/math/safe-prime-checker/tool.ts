import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";

export type SafePrimeCheckerInput = {
  readonly p: number;
};
export type SafePrimeCheckerOutput = {
  readonly isSafePrime: boolean;
};

export const safePrimeCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: {
      type: "integer",
      minimum: 0,
      maximum: 1000000000000,
      description: "Candidate prime (trial-division resource limit 10^12)",
    },
  },
  required: ["p"],
} as const satisfies ToolJsonSchema;
export const safePrimeCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isSafePrime: {
      type: "boolean",
      description: "Whether p is a safe prime",
    },
  },
  required: ["isSafePrime"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A005385
export const calculateSafePrimeChecker = (rawInput: unknown): ToolResult<SafePrimeCheckerOutput> => {
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
  if (pValue < 0)
    return issue("p", "out_of_range", "Value must be at least 0.");
  if (pValue > 1000000000000)
    return issue("p", "resource_limit", "Value must be at most 1000000000000.");
  const input: SafePrimeCheckerInput = { p: pValue };
  return toolSuccess({ isSafePrime: isPrimeInteger(input.p) && isPrimeInteger((input.p - 1) / 2) });
};

export const example = {
  input: {
    p: 23,
  },
  output: {
    isSafePrime: true,
  },
} satisfies ToolExample<SafePrimeCheckerInput, SafePrimeCheckerOutput>;

export const safePrimeCheckerTool = defineTool<SafePrimeCheckerInput, SafePrimeCheckerOutput>({
  id: "math/safe-prime-checker",
  title: "Safe Prime Checker",
  description: "Check whether p is prime and (p−1)/2 is prime, with p capped at 10¹² for bounded trial division.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: safePrimeCheckerInputSchema,
  outputSchema: safePrimeCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "p",
        label: "Candidate prime (trial-division resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isSafePrime",
        label: "Whether p is a safe prime",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateSafePrimeChecker,
});
export const runSafePrimeChecker = safePrimeCheckerTool.execute;
export default safePrimeCheckerTool;
