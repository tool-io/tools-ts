import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";
import { extendedEuclid } from "../extended-euclidean-coefficients/tool.js";

export type RamanujanSumInput = {
  readonly modulus: number;
  readonly frequency: string;
};
export type RamanujanSumOutput = {
  readonly value: string;
};

export const ramanujanSumInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modulus: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Positive modulus q (trial-division resource limit 10^12)",
    },
    frequency: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Signed integer frequency k",
    },
  },
  required: ["modulus", "frequency"],
} as const satisfies ToolJsonSchema;
export const ramanujanSumOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Exact Ramanujan sum",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.10
export const calculateRamanujanSum = (rawInput: unknown): ToolResult<RamanujanSumOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly modulus?: unknown;
    readonly frequency?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["modulus", "frequency"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const modulusValue = candidate.modulus;
  if (typeof modulusValue !== "number" || !Number.isSafeInteger(modulusValue))
    return issue("modulus", "invalid_type", "Enter a finite safe integer.");
  if (modulusValue < 1)
    return issue("modulus", "out_of_range", "Value must be at least 1.");
  if (modulusValue > 1000000000000)
    return issue("modulus", "resource_limit", "Value must be at most 1000000000000.");
  const frequencyValue = candidate.frequency;
  if (typeof frequencyValue !== "string")
    return issue("frequency", "invalid_type", "Enter an integer as a decimal string.");
  if (frequencyValue.length > 200)
    return issue("frequency", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(frequencyValue))
    return issue("frequency", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: RamanujanSumInput = { modulus: modulusValue, frequency: frequencyValue };
  const q = BigInt(input.modulus);
  const { gcd } = extendedEuclid(q, BigInt(input.frequency));
  const reduced = Number(q / gcd);
  const reducedFactors = factorPositiveInteger(reduced);
  if (reducedFactors.some(({ exponent }) => exponent > 1)) return toolSuccess({ value: "0" });
  const totient = (value: number): bigint => {
    let result = BigInt(value);
    for (const { prime } of factorPositiveInteger(value)) result = result / BigInt(prime) * BigInt(prime - 1);
    return result;
  };
  const sign = reducedFactors.length % 2 === 0 ? 1n : -1n;
  return toolSuccess({ value: (sign * totient(input.modulus) / totient(reduced)).toString() });
};

export const example = {
  input: {
    modulus: 12,
    frequency: "4",
  },
  output: {
    value: "-2",
  },
} satisfies ToolExample<RamanujanSumInput, RamanujanSumOutput>;

export const ramanujanSumTool = defineTool<RamanujanSumInput, RamanujanSumOutput>({
  id: "math/ramanujan-sum",
  title: "Ramanujan Sum",
  description: "Return the exact integer c_q(k), the sum of exp(2πiak/q) over residues a coprime to q, using the Möbius–totient formula and q≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: ramanujanSumInputSchema,
  outputSchema: ramanujanSumOutputSchema,
  ports: {
    inputs: [
      {
        id: "modulus",
        label: "Positive modulus q (trial-division resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "frequency",
        label: "Signed integer frequency k",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Exact Ramanujan sum",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateRamanujanSum,
});
export const runRamanujanSum = ramanujanSumTool.execute;
export default ramanujanSumTool;
