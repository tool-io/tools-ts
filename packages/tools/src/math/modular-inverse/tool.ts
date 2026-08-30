import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { extendedEuclid } from "../extended-euclidean-coefficients/tool.js";

export type ModularInverseInput = {
  readonly value: string;
  readonly modulus: string;
};
export type ModularInverseOutput = {
  readonly inverse: string;
};

export const modularInverseInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Signed integer",
    },
    modulus: {
      type: "string",
      pattern: "^[1-9][0-9]*$",
      maxLength: 200,
      description: "Positive modulus",
    },
  },
  required: ["value", "modulus"],
} as const satisfies ToolJsonSchema;
export const modularInverseOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverse: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Least nonnegative modular inverse",
    },
  },
  required: ["inverse"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://math.libretexts.org/Courses/Mount_Royal_University/Higher_Arithmetic/4%3A_Greatest_Common_Divisor_least_common_multiple_and_Euclidean_Algorithm/4.5%3A_Linear_Congruences
export const calculateModularInverse = (rawInput: unknown): ToolResult<ModularInverseOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly value?: unknown;
    readonly modulus?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["value", "modulus"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valueValue = candidate.value;
  if (typeof valueValue !== "string")
    return issue("value", "invalid_type", "Enter an integer as a decimal string.");
  if (valueValue.length > 200)
    return issue("value", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(valueValue))
    return issue("value", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const modulusValue = candidate.modulus;
  if (typeof modulusValue !== "string")
    return issue("modulus", "invalid_type", "Enter an integer as a decimal string.");
  if (modulusValue.length > 200)
    return issue("modulus", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^[1-9][0-9]*$/.test(modulusValue))
    return issue("modulus", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: ModularInverseInput = { value: valueValue, modulus: modulusValue };
  const modulus = BigInt(input.modulus);
  if (modulus < 2n) return issue("modulus", "invalid_modulus", "Modulus must be at least two.");
  const result = extendedEuclid(BigInt(input.value), modulus);
  if (result.gcd !== 1n) return issue("value", "not_invertible", "Value and modulus must be coprime.");
  return toolSuccess({ inverse: ((result.x % modulus + modulus) % modulus).toString() });
};

export const example = {
  input: {
    value: "17",
    modulus: "43",
  },
  output: {
    inverse: "38",
  },
} satisfies ToolExample<ModularInverseInput, ModularInverseOutput>;

export const modularInverseTool = defineTool<ModularInverseInput, ModularInverseOutput>({
  id: "math/modular-inverse",
  title: "Modular Inverse",
  description: "Find the least nonnegative inverse of a signed decimal integer modulo a decimal modulus of at least two, rejecting noncoprime pairs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: modularInverseInputSchema,
  outputSchema: modularInverseOutputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Signed integer",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "modulus",
        label: "Positive modulus",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "inverse",
        label: "Least nonnegative modular inverse",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateModularInverse,
});
export const runModularInverse = modularInverseTool.execute;
export default modularInverseTool;
