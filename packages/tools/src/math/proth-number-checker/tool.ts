import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ProthNumberCheckerInput = {
  readonly n: string;
};
export type ProthNumberCheckerOutput = {
  readonly isProth: boolean;
};

export const prothNumberCheckerInputSchema = {
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
export const prothNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isProth: {
      type: "boolean",
      description: "Whether n is a Proth number",
    },
  },
  required: ["isProth"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A080075
export const calculateProthNumberChecker = (rawInput: unknown): ToolResult<ProthNumberCheckerOutput> => {
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
  const input: ProthNumberCheckerInput = { n: nValue };
  const n = BigInt(input.n);
  if (n < 3n || n % 2n === 0n) return toolSuccess({ isProth: false });
  let k = n - 1n, power = 1n;
  while (k % 2n === 0n) { k /= 2n; power *= 2n; }
  return toolSuccess({ isProth: power > 1n && k < power });
};

export const example = {
  input: {
    n: "13",
  },
  output: {
    isProth: true,
  },
} satisfies ToolExample<ProthNumberCheckerInput, ProthNumberCheckerOutput>;

export const prothNumberCheckerTool = defineTool<ProthNumberCheckerInput, ProthNumberCheckerOutput>({
  id: "math/proth-number-checker",
  title: "Proth Number Checker",
  description: "Check whether a decimal integer is k·2^m+1 with m≥1 and positive odd k<2^m, without requiring primality; input is capped at 200 characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: prothNumberCheckerInputSchema,
  outputSchema: prothNumberCheckerOutputSchema,
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
        id: "isProth",
        label: "Whether n is a Proth number",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateProthNumberChecker,
});
export const runProthNumberChecker = prothNumberCheckerTool.execute;
export default prothNumberCheckerTool;
