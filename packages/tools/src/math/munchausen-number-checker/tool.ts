import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MunchausenNumberCheckerInput = {
  readonly n: string;
  readonly zeroPowerZero: number;
};
export type MunchausenNumberCheckerOutput = {
  readonly isMunchausen: boolean;
};

export const munchausenNumberCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "string",
      pattern: "^(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Nonnegative decimal integer",
    },
    zeroPowerZero: {
      type: "integer",
      minimum: 0,
      maximum: 1,
      description: "Value assigned to 0^0: zero or one",
    },
  },
  required: ["n", "zeroPowerZero"],
} as const satisfies ToolJsonSchema;
export const munchausenNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isMunchausen: {
      type: "boolean",
      description: "Whether n equals its digit self-power sum",
    },
  },
  required: ["isMunchausen"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A046253; https://oeis.org/A166623
export const calculateMunchausenNumberChecker = (rawInput: unknown): ToolResult<MunchausenNumberCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly n?: unknown;
    readonly zeroPowerZero?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["n", "zeroPowerZero"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nValue = candidate.n;
  if (typeof nValue !== "string")
    return issue("n", "invalid_type", "Enter an integer as a decimal string.");
  if (nValue.length > 200)
    return issue("n", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^(0|[1-9][0-9]*)$/.test(nValue))
    return issue("n", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const zeroPowerZeroValue = candidate.zeroPowerZero;
  if (typeof zeroPowerZeroValue !== "number" || !Number.isSafeInteger(zeroPowerZeroValue))
    return issue("zeroPowerZero", "invalid_type", "Enter a finite safe integer.");
  if (zeroPowerZeroValue < 0)
    return issue("zeroPowerZero", "out_of_range", "Value must be at least 0.");
  if (zeroPowerZeroValue > 1)
    return issue("zeroPowerZero", "out_of_range", "Value must be at most 1.");
  const input: MunchausenNumberCheckerInput = { n: nValue, zeroPowerZero: zeroPowerZeroValue };
  let sum = 0n;
  for (const digit of input.n) {
    const d = BigInt(digit);
    sum += d === 0n ? BigInt(input.zeroPowerZero) : d ** d;
  }
  return toolSuccess({ isMunchausen: sum === BigInt(input.n) });
};

export const example = {
  input: {
    n: "3435",
    zeroPowerZero: 1,
  },
  output: {
    isMunchausen: true,
  },
} satisfies ToolExample<MunchausenNumberCheckerInput, MunchausenNumberCheckerOutput>;

export const munchausenNumberCheckerTool = defineTool<MunchausenNumberCheckerInput, MunchausenNumberCheckerOutput>({
  id: "math/munchausen-number-checker",
  title: "Münchhausen Digit Self-Power Checker",
  description: "Check whether n equals the sum of d^d over its decimal digits under an explicit 0^0 convention of zero or one, using exact integers up to 200 input characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: munchausenNumberCheckerInputSchema,
  outputSchema: munchausenNumberCheckerOutputSchema,
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
      {
        id: "zeroPowerZero",
        label: "Value assigned to 0^0: zero or one",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isMunchausen",
        label: "Whether n equals its digit self-power sum",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateMunchausenNumberChecker,
});
export const runMunchausenNumberChecker = munchausenNumberCheckerTool.execute;
export default munchausenNumberCheckerTool;
