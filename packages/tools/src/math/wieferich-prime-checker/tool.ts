import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";
import { modularPower } from "../pseudoprime-base2-checker/tool.js";

export type WieferichPrimeCheckerInput = {
  readonly p: number;
};
export type WieferichPrimeCheckerOutput = {
  readonly isWieferich: boolean;
};

export const wieferichPrimeCheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Candidate prime (primality resource limit 10^12)",
    },
  },
  required: ["p"],
} as const satisfies ToolJsonSchema;
export const wieferichPrimeCheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isWieferich: {
      type: "boolean",
      description: "Whether p is a base-two Wieferich prime",
    },
  },
  required: ["isWieferich"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/A001220
export const calculateWieferichPrimeChecker = (rawInput: unknown): ToolResult<WieferichPrimeCheckerOutput> => {
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
  if (pValue < 1)
    return issue("p", "out_of_range", "Value must be at least 1.");
  if (pValue > 1000000000000)
    return issue("p", "resource_limit", "Value must be at most 1000000000000.");
  const input: WieferichPrimeCheckerInput = { p: pValue };
  if (!isPrimeInteger(input.p)) return toolSuccess({ isWieferich: false });
  const p = BigInt(input.p);
  return toolSuccess({ isWieferich: modularPower(2n, p - 1n, p * p) === 1n });
};

export const example = {
  input: {
    p: 1093,
  },
  output: {
    isWieferich: true,
  },
} satisfies ToolExample<WieferichPrimeCheckerInput, WieferichPrimeCheckerOutput>;

export const wieferichPrimeCheckerTool = defineTool<WieferichPrimeCheckerInput, WieferichPrimeCheckerOutput>({
  id: "math/wieferich-prime-checker",
  title: "Wieferich Prime Checker",
  description: "Check whether p is prime and 2^(p−1)≡1 (mod p²) with exact modular arithmetic; primality testing is limited to p≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: wieferichPrimeCheckerInputSchema,
  outputSchema: wieferichPrimeCheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "p",
        label: "Candidate prime (primality resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isWieferich",
        label: "Whether p is a base-two Wieferich prime",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculateWieferichPrimeChecker,
});
export const runWieferichPrimeChecker = wieferichPrimeCheckerTool.execute;
export default wieferichPrimeCheckerTool;
