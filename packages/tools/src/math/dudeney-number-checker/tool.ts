import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DudeneyNumberCheckerInput = {
  readonly n: string;
};
export type DudeneyNumberCheckerOutput = {
  readonly isDudeney: boolean;
};

export const dudeneyNumberCheckerInputSchema = {
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
export const dudeneyNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isDudeney: {
      type: "boolean",
      description: "Whether n is the cube of its decimal digit sum",
    },
  },
  required: ["isDudeney"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A061209
export const calculateDudeneyNumberChecker = (rawInput: unknown): ToolResult<DudeneyNumberCheckerOutput> => {
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
    return issue("n", "invalid_format", "Enter a nonnegative decimal integer without leading zeros.");
  const input: DudeneyNumberCheckerInput = { n: nValue };
  let digitSum = 0n;
  for (const digit of input.n) digitSum += BigInt(digit);
  return toolSuccess({ isDudeney: digitSum ** 3n === BigInt(input.n) });
};

export const example = {
  input: {
    n: "512",
  },
  output: {
    isDudeney: true,
  },
} satisfies ToolExample<DudeneyNumberCheckerInput, DudeneyNumberCheckerOutput>;

export const dudeneyNumberCheckerTool = defineTool<DudeneyNumberCheckerInput, DudeneyNumberCheckerOutput>({
  id: "math/dudeney-number-checker",
  title: "Dudeney Number Checker",
  description: "Check whether a nonnegative decimal integer equals the cube of the sum of its decimal digits, using exact arithmetic and a 200-character input resource limit.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dudeneyNumberCheckerInputSchema,
  outputSchema: dudeneyNumberCheckerOutputSchema,
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
        id: "isDudeney",
        label: "Whether n is the cube of its decimal digit sum",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateDudeneyNumberChecker,
});
export const runDudeneyNumberChecker = dudeneyNumberCheckerTool.execute;
export default dudeneyNumberCheckerTool;
