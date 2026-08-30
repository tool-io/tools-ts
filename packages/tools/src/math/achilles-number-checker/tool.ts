import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type AchillesNumberCheckerInput = {
  readonly n: number;
};
export type AchillesNumberCheckerOutput = {
  readonly isAchilles: boolean;
};

export const achillesNumberCheckerInputSchema = {
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
export const achillesNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isAchilles: {
      type: "boolean",
      description: "Whether n is an Achilles number",
    },
  },
  required: ["isAchilles"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A052486
export const calculateAchillesNumberChecker = (rawInput: unknown): ToolResult<AchillesNumberCheckerOutput> => {
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
  const input: AchillesNumberCheckerInput = { n: nValue };
  const factors = factorPositiveInteger(input.n);
  if (factors.length === 0 || factors.some(({ exponent }) => exponent < 2)) return toolSuccess({ isAchilles: false });
  let gcd = 0;
  for (const { exponent } of factors) {
    let next = exponent;
    while (next !== 0) [gcd, next] = [next, gcd % next];
  }
  return toolSuccess({ isAchilles: gcd === 1 });
};

export const example = {
  input: {
    n: 72,
  },
  output: {
    isAchilles: true,
  },
} satisfies ToolExample<AchillesNumberCheckerInput, AchillesNumberCheckerOutput>;

export const achillesNumberCheckerTool = defineTool<AchillesNumberCheckerInput, AchillesNumberCheckerOutput>({
  id: "math/achilles-number-checker",
  title: "Achilles Number Checker",
  description: "Check whether n is powerful but not a perfect power by testing the prime exponents and their gcd; trial division is limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: achillesNumberCheckerInputSchema,
  outputSchema: achillesNumberCheckerOutputSchema,
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
        id: "isAchilles",
        label: "Whether n is an Achilles number",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateAchillesNumberChecker,
});
export const runAchillesNumberChecker = achillesNumberCheckerTool.execute;
export default achillesNumberCheckerTool;
