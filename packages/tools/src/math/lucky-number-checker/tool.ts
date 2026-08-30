import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type LuckyNumberCheckerInput = {
  readonly n: number;
};
export type LuckyNumberCheckerOutput = {
  readonly isLucky: boolean;
};

export const luckyNumberCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 0,
      maximum: 100000,
      description: "Nonnegative integer (sieve resource limit 100000)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const luckyNumberCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isLucky: {
      type: "boolean",
      description: "Whether n survives the lucky-number sieve",
    },
  },
  required: ["isLucky"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A000959
export const calculateLuckyNumberChecker = (rawInput: unknown): ToolResult<LuckyNumberCheckerOutput> => {
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
  if (nValue > 100000)
    return issue("n", "resource_limit", "Value must be at most 100000.");
  const input: LuckyNumberCheckerInput = { n: nValue };
  if (input.n === 0 || input.n % 2 === 0) return toolSuccess({ isLucky: false });
  let survivors = Array.from({ length: (input.n + 1) / 2 }, (_, index) => 2 * index + 1);
  for (let index = 1; index < survivors.length; index++) {
    const step = survivors[index];
    if (step === undefined) throw new Error("Missing sieve step");
    if (step > survivors.length) break;
    survivors = survivors.filter((_, position) => (position + 1) % step !== 0);
  }
  return toolSuccess({ isLucky: survivors.includes(input.n) });
};

export const example = {
  input: {
    n: 21,
  },
  output: {
    isLucky: true,
  },
} satisfies ToolExample<LuckyNumberCheckerInput, LuckyNumberCheckerOutput>;

export const luckyNumberCheckerTool = defineTool<LuckyNumberCheckerInput, LuckyNumberCheckerOutput>({
  id: "math/lucky-number-checker",
  title: "Lucky Number Checker",
  description: "Test membership in the lucky-number sieve that starts with positive odd integers and repeatedly removes every kth survivor; input is capped at 100,000.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: luckyNumberCheckerInputSchema,
  outputSchema: luckyNumberCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Nonnegative integer (sieve resource limit 100000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isLucky",
        label: "Whether n survives the lucky-number sieve",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateLuckyNumberChecker,
});
export const runLuckyNumberChecker = luckyNumberCheckerTool.execute;
export default luckyNumberCheckerTool;
