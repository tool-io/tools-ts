import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type CarmichaelNumberCheckerInput = {
  readonly n: number;
};
export type CarmichaelNumberCheckerOutput = {
  readonly isCarmichael: boolean;
};

export const carmichaelNumberCheckerInputSchema = {
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
export const carmichaelNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isCarmichael: {
      type: "boolean",
      description: "Whether n is a Carmichael number",
    },
  },
  required: ["isCarmichael"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A002997
export const calculateCarmichaelNumberChecker = (rawInput: unknown): ToolResult<CarmichaelNumberCheckerOutput> => {
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
  const input: CarmichaelNumberCheckerInput = { n: nValue };
  const factors = factorPositiveInteger(input.n);
  const n = BigInt(input.n);
  return toolSuccess({ isCarmichael: factors.length > 1 && factors.every(({ prime, exponent }) => exponent === 1 && (n - 1n) % BigInt(prime - 1) === 0n) });
};

export const example = {
  input: {
    n: 561,
  },
  output: {
    isCarmichael: true,
  },
} satisfies ToolExample<CarmichaelNumberCheckerInput, CarmichaelNumberCheckerOutput>;

export const carmichaelNumberCheckerTool = defineTool<CarmichaelNumberCheckerInput, CarmichaelNumberCheckerOutput>({
  id: "math/carmichael-number-checker",
  title: "Carmichael Number Checker",
  description: "Check the composite, square-free, and p−1-divides-n−1 conditions of Korselt’s criterion for a Carmichael number; trial division is limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: carmichaelNumberCheckerInputSchema,
  outputSchema: carmichaelNumberCheckerOutputSchema,
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
        id: "isCarmichael",
        label: "Whether n is a Carmichael number",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateCarmichaelNumberChecker,
});
export const runCarmichaelNumberChecker = carmichaelNumberCheckerTool.execute;
export default carmichaelNumberCheckerTool;
