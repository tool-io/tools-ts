import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type SphenicNumberCheckerInput = {
  readonly n: number;
};
export type SphenicNumberCheckerOutput = {
  readonly isSphenic: boolean;
};

export const sphenicNumberCheckerInputSchema = {
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
export const sphenicNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isSphenic: {
      type: "boolean",
      description: "Whether n is sphenic",
    },
  },
  required: ["isSphenic"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A007304
export const calculateSphenicNumberChecker = (rawInput: unknown): ToolResult<SphenicNumberCheckerOutput> => {
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
  const input: SphenicNumberCheckerInput = { n: nValue };
  const factors = factorPositiveInteger(input.n);
  return toolSuccess({ isSphenic: factors.length === 3 && factors.every(({ exponent }) => exponent === 1) });
};

export const example = {
  input: {
    n: 30,
  },
  output: {
    isSphenic: true,
  },
} satisfies ToolExample<SphenicNumberCheckerInput, SphenicNumberCheckerOutput>;

export const sphenicNumberCheckerTool = defineTool<SphenicNumberCheckerInput, SphenicNumberCheckerOutput>({
  id: "math/sphenic-number-checker",
  title: "Sphenic Number Checker",
  description: "Check whether n is the product of exactly three distinct primes, each with exponent one; trial division is limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sphenicNumberCheckerInputSchema,
  outputSchema: sphenicNumberCheckerOutputSchema,
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
        id: "isSphenic",
        label: "Whether n is sphenic",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateSphenicNumberChecker,
});
export const runSphenicNumberChecker = sphenicNumberCheckerTool.execute;
export default sphenicNumberCheckerTool;
