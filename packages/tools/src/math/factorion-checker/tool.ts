import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FactorionCheckerInput = {
  readonly n: string;
};
export type FactorionCheckerOutput = {
  readonly isFactorion: boolean;
};

export const factorionCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Nonnegative decimal integer",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const factorionCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isFactorion: {
      type: "boolean",
      description: "Whether n equals its digit-factorial sum",
    },
  },
  required: ["isFactorion"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A014080
export const calculateFactorionChecker = (rawInput: unknown): ToolResult<FactorionCheckerOutput> => {
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
  if (typeof nValue !== "string")
    return issue("n", "invalid_type", "Enter an integer as a decimal string.");
  if (nValue.length > 200)
    return issue("n", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(nValue))
    return issue("n", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: FactorionCheckerInput = { n: nValue };
  const factorials = [1n];
  let factorial = 1n;
  for (let digit = 1; digit <= 9; digit++) { factorial *= BigInt(digit); factorials.push(factorial); }
  let sum = 0n;
  for (const digit of input.n) sum += factorials[Number(digit)] ?? 0n;
  return toolSuccess({ isFactorion: sum === BigInt(input.n) });
};

export const example = {
  input: {
    n: "145",
  },
  output: {
    isFactorion: true,
  },
} satisfies ToolExample<FactorionCheckerInput, FactorionCheckerOutput>;

export const factorionCheckerTool = defineTool<FactorionCheckerInput, FactorionCheckerOutput>({
  id: "math/factorion-checker",
  title: "Factorion Checker",
  description: "Check whether a nonnegative decimal integer equals the sum of factorials of its digits, including 0!=1 and an input resource limit of 200 characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: factorionCheckerInputSchema,
  outputSchema: factorionCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative decimal integer",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "isFactorion",
        label: "Whether n equals its digit-factorial sum",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateFactorionChecker,
});
export const runFactorionChecker = factorionCheckerTool.execute;
export default factorionCheckerTool;
