import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type WoodallNumberCheckerInput = {
  readonly n: string;
};
export type WoodallNumberCheckerOutput = {
  readonly isWoodall: boolean;
};

export const woodallNumberCheckerInputSchema = {
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
export const woodallNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isWoodall: {
      type: "boolean",
      description: "Whether n is a Woodall number",
    },
  },
  required: ["isWoodall"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A003261
export const calculateWoodallNumberChecker = (rawInput: unknown): ToolResult<WoodallNumberCheckerOutput> => {
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
  const input: WoodallNumberCheckerInput = { n: nValue };
  const n = BigInt(input.n);
  for (let k = 1n; ; k++) {
    const candidate = (k << k) - 1n;
    if (candidate === n) return toolSuccess({ isWoodall: true });
    if (candidate > n) return toolSuccess({ isWoodall: false });
  }
};

export const example = {
  input: {
    n: "63",
  },
  output: {
    isWoodall: true,
  },
} satisfies ToolExample<WoodallNumberCheckerInput, WoodallNumberCheckerOutput>;

export const woodallNumberCheckerTool = defineTool<WoodallNumberCheckerInput, WoodallNumberCheckerOutput>({
  id: "math/woodall-number-checker",
  title: "Woodall Number Checker",
  description: "Check whether a nonnegative decimal integer has the form k·2^k−1 for k≥1, without requiring primality; input is capped at 200 characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: woodallNumberCheckerInputSchema,
  outputSchema: woodallNumberCheckerOutputSchema,
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
        id: "isWoodall",
        label: "Whether n is a Woodall number",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateWoodallNumberChecker,
});
export const runWoodallNumberChecker = woodallNumberCheckerTool.execute;
export default woodallNumberCheckerTool;
