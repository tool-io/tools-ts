import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";

export type PowerfulNumberCheckerInput = {
  readonly n: number;
};
export type PowerfulNumberCheckerOutput = {
  readonly isPowerful: boolean;
};

export const powerfulNumberCheckerInputSchema = {
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
export const powerfulNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isPowerful: {
      type: "boolean",
      description: "Whether n is powerful",
    },
  },
  required: ["isPowerful"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A001694
export const calculatePowerfulNumberChecker = (rawInput: unknown): ToolResult<PowerfulNumberCheckerOutput> => {
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
  const input: PowerfulNumberCheckerInput = { n: nValue };
  return toolSuccess({ isPowerful: factorPositiveInteger(input.n).every(({ exponent }) => exponent >= 2) });
};

export const example = {
  input: {
    n: 72,
  },
  output: {
    isPowerful: true,
  },
} satisfies ToolExample<PowerfulNumberCheckerInput, PowerfulNumberCheckerOutput>;

export const powerfulNumberCheckerTool = defineTool<PowerfulNumberCheckerInput, PowerfulNumberCheckerOutput>({
  id: "math/powerful-number-checker",
  title: "Powerful Number Checker",
  description: "Check whether every prime divisor of n occurs with exponent at least two, treating one as powerful; trial division is limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: powerfulNumberCheckerInputSchema,
  outputSchema: powerfulNumberCheckerOutputSchema,
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
        id: "isPowerful",
        label: "Whether n is powerful",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculatePowerfulNumberChecker,
});
export const runPowerfulNumberChecker = powerfulNumberCheckerTool.execute;
export default powerfulNumberCheckerTool;
