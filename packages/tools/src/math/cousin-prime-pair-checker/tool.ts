import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";

export type CousinPrimePairCheckerInput = {
  readonly first: number;
  readonly second: number;
};
export type CousinPrimePairCheckerOutput = {
  readonly isCousinPair: boolean;
};

export const cousinPrimePairCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "integer",
      minimum: 0,
      maximum: 1000000000000,
      description: "First candidate (resource limit 10^12)",
    },
    second: {
      type: "integer",
      minimum: 0,
      maximum: 1000000000000,
      description: "Second candidate (resource limit 10^12)",
    },
  },
  required: ["first", "second"],
} as const satisfies ToolJsonSchema;
export const cousinPrimePairCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isCousinPair: {
      type: "boolean",
      description: "Whether the candidates are cousin primes",
    },
  },
  required: ["isCousinPair"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A023200
export const calculateCousinPrimePairChecker = (rawInput: unknown): ToolResult<CousinPrimePairCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly first?: unknown;
    readonly second?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["first", "second"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const firstValue = candidate.first;
  if (typeof firstValue !== "number" || !Number.isSafeInteger(firstValue))
    return issue("first", "invalid_type", "Enter a finite safe integer.");
  if (firstValue < 0)
    return issue("first", "out_of_range", "Value must be at least 0.");
  if (firstValue > 1000000000000)
    return issue("first", "resource_limit", "Value must be at most 1000000000000.");
  const secondValue = candidate.second;
  if (typeof secondValue !== "number" || !Number.isSafeInteger(secondValue))
    return issue("second", "invalid_type", "Enter a finite safe integer.");
  if (secondValue < 0)
    return issue("second", "out_of_range", "Value must be at least 0.");
  if (secondValue > 1000000000000)
    return issue("second", "resource_limit", "Value must be at most 1000000000000.");
  const input: CousinPrimePairCheckerInput = { first: firstValue, second: secondValue };
  return toolSuccess({ isCousinPair: Math.abs(input.first - input.second) === 4 && isPrimeInteger(input.first) && isPrimeInteger(input.second) });
};

export const example = {
  input: {
    first: 7,
    second: 11,
  },
  output: {
    isCousinPair: true,
  },
} satisfies ToolExample<CousinPrimePairCheckerInput, CousinPrimePairCheckerOutput>;

export const cousinPrimePairCheckerTool = defineTool<CousinPrimePairCheckerInput, CousinPrimePairCheckerOutput>({
  id: "math/cousin-prime-pair-checker",
  title: "Cousin Prime Pair Checker",
  description: "Check whether two nonnegative integers are prime and differ by four, accepting either order and limiting each candidate to 10¹² for trial division.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: cousinPrimePairCheckerInputSchema,
  outputSchema: cousinPrimePairCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "first",
        label: "First candidate (resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "second",
        label: "Second candidate (resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isCousinPair",
        label: "Whether the candidates are cousin primes",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateCousinPrimePairChecker,
});
export const runCousinPrimePairChecker = cousinPrimePairCheckerTool.execute;
export default cousinPrimePairCheckerTool;
