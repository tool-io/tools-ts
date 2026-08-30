import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";

export type SophieGermainPrimeCheckerInput = {
  readonly p: number;
};
export type SophieGermainPrimeCheckerOutput = {
  readonly isSophieGermain: boolean;
};

export const sophieGermainPrimeCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: {
      type: "integer",
      minimum: 0,
      maximum: 1000000000000,
      description: "Candidate prime (trial-division resource limit 10^12)",
    },
  },
  required: ["p"],
} as const satisfies ToolJsonSchema;
export const sophieGermainPrimeCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isSophieGermain: {
      type: "boolean",
      description: "Whether p is a Sophie Germain prime",
    },
  },
  required: ["isSophieGermain"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A005384
export const calculateSophieGermainPrimeChecker = (rawInput: unknown): ToolResult<SophieGermainPrimeCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly p?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["p"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const pValue = candidate.p;
  if (typeof pValue !== "number" || !Number.isSafeInteger(pValue))
    return issue("p", "invalid_type", "Enter a finite safe integer.");
  if (pValue < 0)
    return issue("p", "out_of_range", "Value must be at least 0.");
  if (pValue > 1000000000000)
    return issue("p", "resource_limit", "Value must be at most 1000000000000.");
  const input: SophieGermainPrimeCheckerInput = { p: pValue };
  return toolSuccess({ isSophieGermain: isPrimeInteger(input.p) && isPrimeInteger(2 * input.p + 1) });
};

export const example = {
  input: {
    p: 23,
  },
  output: {
    isSophieGermain: true,
  },
} satisfies ToolExample<SophieGermainPrimeCheckerInput, SophieGermainPrimeCheckerOutput>;

export const sophieGermainPrimeCheckerTool = defineTool<SophieGermainPrimeCheckerInput, SophieGermainPrimeCheckerOutput>({
  id: "math/sophie-germain-prime-checker",
  title: "Sophie Germain Prime Checker",
  description: "Check whether both p and 2p+1 are prime by deterministic trial division, with p capped at 10¹² for bounded work.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sophieGermainPrimeCheckerInputSchema,
  outputSchema: sophieGermainPrimeCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "p",
        label: "Candidate prime (trial-division resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isSophieGermain",
        label: "Whether p is a Sophie Germain prime",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateSophieGermainPrimeChecker,
});
export const runSophieGermainPrimeChecker = sophieGermainPrimeCheckerTool.execute;
export default sophieGermainPrimeCheckerTool;
