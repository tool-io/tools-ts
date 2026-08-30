import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type RoughNumberCheckerInput = {
  readonly n: number;
  readonly bound: number;
};
export type RoughNumberCheckerOutput = {
  readonly isRough: boolean;
};

export const roughNumberCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Positive integer (trial-division resource limit 10^12)",
    },
    bound: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
      description: "Inclusive lower prime-factor bound",
    },
  },
  required: ["n", "bound"],
} as const satisfies ToolJsonSchema;
export const roughNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isRough: {
      type: "boolean",
      description: "Whether every prime factor is at least the bound",
    },
  },
  required: ["isRough"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A007775
export const calculateRoughNumberChecker = (rawInput: unknown): ToolResult<RoughNumberCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
    readonly bound?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n", "bound"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "number" || !Number.isSafeInteger(nValue))
    return issue("n", "invalid_type", "Enter a finite safe integer.");
  if (nValue < 1)
    return issue("n", "out_of_range", "Value must be at least 1.");
  if (nValue > 1000000000000)
    return issue("n", "resource_limit", "Value must be at most 1000000000000.");
  const boundValue = candidate.bound;
  if (typeof boundValue !== "number" || !Number.isSafeInteger(boundValue))
    return issue("bound", "invalid_type", "Enter a finite safe integer.");
  if (boundValue < 1)
    return issue("bound", "out_of_range", "Value must be at least 1.");
  if (boundValue > 9007199254740991)
    return issue("bound", "out_of_range", "Value must be at most 9007199254740991.");
  const input: RoughNumberCheckerInput = { n: nValue, bound: boundValue };
  return toolSuccess({ isRough: factorPositiveInteger(input.n).every(({ prime }) => prime >= input.bound) });
};

export const example = {
  input: {
    n: 77,
    bound: 7,
  },
  output: {
    isRough: true,
  },
} satisfies ToolExample<RoughNumberCheckerInput, RoughNumberCheckerOutput>;

export const roughNumberCheckerTool = defineTool<RoughNumberCheckerInput, RoughNumberCheckerOutput>({
  id: "math/rough-number-checker",
  title: "Rough Number Checker",
  description: "Check whether every prime factor of n is at least an inclusive bound B, treating one as B-rough; trial division is limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: roughNumberCheckerInputSchema,
  outputSchema: roughNumberCheckerOutputSchema,
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
      {
        id: "bound",
        label: "Inclusive lower prime-factor bound",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isRough",
        label: "Whether every prime factor is at least the bound",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateRoughNumberChecker,
});
export const runRoughNumberChecker = roughNumberCheckerTool.execute;
export default roughNumberCheckerTool;
