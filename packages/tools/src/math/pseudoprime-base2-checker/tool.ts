import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isPrimeInteger } from "../practical-number-checker/tool.js";

export type PseudoprimeBase2CheckerInput = {
  readonly n: number;
};
export type PseudoprimeBase2CheckerOutput = {
  readonly isPseudoprime: boolean;
};

export const pseudoprimeBase2CheckerInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Positive integer (primality resource limit 10^12)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const pseudoprimeBase2CheckerOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isPseudoprime: {
      type: "boolean",
      description: "Whether n is a base-two Fermat pseudoprime",
    },
  },
  required: ["isPseudoprime"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const modularPower = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
  if (exponent < 0n || modulus < 1n) throw new RangeError("Use a nonnegative exponent and positive modulus.");
  let factor = ((base % modulus) + modulus) % modulus;
  let remaining = exponent, result = 1n % modulus;
  while (remaining > 0n) {
    if (remaining % 2n === 1n) result = result * factor % modulus;
    factor = factor * factor % modulus;
    remaining /= 2n;
  }
  return result;
};

// Definition and independently known values: https://oeis.org/A001567
export const calculatePseudoprimeBase2Checker = (rawInput: unknown): ToolResult<PseudoprimeBase2CheckerOutput> => {
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
  const input: PseudoprimeBase2CheckerInput = { n: nValue };
  if (input.n < 3 || input.n % 2 === 0 || isPrimeInteger(input.n)) return toolSuccess({ isPseudoprime: false });
  const n = BigInt(input.n);
  return toolSuccess({ isPseudoprime: modularPower(2n, n - 1n, n) === 1n });
};

export const example = {
  input: {
    n: 341,
  },
  output: {
    isPseudoprime: true,
  },
} satisfies ToolExample<PseudoprimeBase2CheckerInput, PseudoprimeBase2CheckerOutput>;

export const pseudoprimeBase2CheckerTool = defineTool<PseudoprimeBase2CheckerInput, PseudoprimeBase2CheckerOutput>({
  id: "math/pseudoprime-base2-checker",
  title: "Base-Two Fermat Pseudoprime Checker",
  description: "Check whether n is composite and 2^(n−1)≡1 (mod n), using exact modular arithmetic and trial primality testing limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: pseudoprimeBase2CheckerInputSchema,
  outputSchema: pseudoprimeBase2CheckerOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Positive integer (primality resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "isPseudoprime",
        label: "Whether n is a base-two Fermat pseudoprime",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: calculatePseudoprimeBase2Checker,
});
export const runPseudoprimeBase2Checker = pseudoprimeBase2CheckerTool.execute;
export default pseudoprimeBase2CheckerTool;
