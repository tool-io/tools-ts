import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TrimorphicNumberCheckerInput = {
  readonly n: string;
};
export type TrimorphicNumberCheckerOutput = {
  readonly isTrimorphic: boolean;
};

export const trimorphicNumberCheckerInputSchema = {
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
export const trimorphicNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isTrimorphic: {
      type: "boolean",
      description: "Whether n cubed ends in n",
    },
  },
  required: ["isTrimorphic"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A033819
export const calculateTrimorphicNumberChecker = (rawInput: unknown): ToolResult<TrimorphicNumberCheckerOutput> => {
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
  const input: TrimorphicNumberCheckerInput = { n: nValue };
  const n = BigInt(input.n);
  const width = n.toString().length;
  return toolSuccess({ isTrimorphic: (n ** 3n) % (10n ** BigInt(width)) === n });
};

export const example = {
  input: {
    n: "24",
  },
  output: {
    isTrimorphic: true,
  },
} satisfies ToolExample<TrimorphicNumberCheckerInput, TrimorphicNumberCheckerOutput>;

export const trimorphicNumberCheckerTool = defineTool<TrimorphicNumberCheckerInput, TrimorphicNumberCheckerOutput>({
  id: "math/trimorphic-number-checker",
  title: "Trimorphic Number Checker",
  description: "Check whether the decimal digits of a nonnegative integer are the final digits of its cube, using exact arithmetic and a 200-character input limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: trimorphicNumberCheckerInputSchema,
  outputSchema: trimorphicNumberCheckerOutputSchema,
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
        id: "isTrimorphic",
        label: "Whether n cubed ends in n",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateTrimorphicNumberChecker,
});
export const runTrimorphicNumberChecker = trimorphicNumberCheckerTool.execute;
export default trimorphicNumberCheckerTool;
