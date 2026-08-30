import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type KeithNumberCheckerInput = {
  readonly n: number;
};
export type KeithNumberCheckerOutput = {
  readonly isKeith: boolean;
};

export const keithNumberCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 1000000000000,
      description: "Nonnegative integer (resource limit 10^12)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const keithNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isKeith: {
      type: "boolean",
      description: "Whether n is a nontrivial Keith number",
    },
  },
  required: ["isKeith"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A007629
export const calculateKeithNumberChecker = (rawInput: unknown): ToolResult<KeithNumberCheckerOutput> => {
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
  if (nValue < 0)
    return issue("n", "out_of_range", "Value must be at least 0.");
  if (nValue > 1000000000000)
    return issue("n", "resource_limit", "Value must be at most 1000000000000.");
  const input: KeithNumberCheckerInput = { n: nValue };
  if (input.n < 10) return toolSuccess({ isKeith: false });
  const digits = input.n.toString().split("").map((digit) => BigInt(digit));
  const target = BigInt(input.n);
  let sum = digits.reduce((total, digit) => total + digit, 0n);
  let cursor = 0;
  while (sum < target) {
    const outgoing = digits[cursor];
    if (outgoing === undefined) throw new Error("Missing recurrence term");
    digits[cursor] = sum;
    sum = 2n * sum - outgoing;
    cursor = (cursor + 1) % digits.length;
  }
  return toolSuccess({ isKeith: sum === target });
};

export const example = {
  input: {
    n: 197,
  },
  output: {
    isKeith: true,
  },
} satisfies ToolExample<KeithNumberCheckerInput, KeithNumberCheckerOutput>;

export const keithNumberCheckerTool = defineTool<KeithNumberCheckerInput, KeithNumberCheckerOutput>({
  id: "math/keith-number-checker",
  title: "Keith Number Checker",
  description: "Check whether a decimal integer of at least two digits reappears in the recurrence seeded by its digits and summing the previous digit-count terms; input is capped at 10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: keithNumberCheckerInputSchema,
  outputSchema: keithNumberCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative integer (resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isKeith",
        label: "Whether n is a nontrivial Keith number",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateKeithNumberChecker,
});
export const runKeithNumberChecker = keithNumberCheckerTool.execute;
export default keithNumberCheckerTool;
