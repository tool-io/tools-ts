import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { extendedEuclid } from "../extended-euclidean-coefficients/tool.js";

export type LinearCongruenceSolutionInput = {
  readonly a: string;
  readonly b: string;
  readonly modulus: string;
};
export type LinearCongruenceSolutionOutput = {
  readonly solvable: boolean;
  readonly residue: string;
  readonly period: string;
  readonly multiplicity: string;
};

export const linearCongruenceSolutionInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Signed coefficient",
    },
    b: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      maxLength: 200,
      description: "Signed right-hand side",
    },
    modulus: {
      type: "string",
      pattern: "^[1-9][0-9]*$",
      maxLength: 200,
      description: "Positive modulus",
    },
  },
  required: ["a", "b", "modulus"],
} as const satisfies ToolJsonSchema;
export const linearCongruenceSolutionOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solvable: {
      type: "boolean",
      description: "Whether the congruence has a solution",
    },
    residue: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Least nonnegative solution",
    },
    period: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Period of all solutions",
    },
    multiplicity: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Number of solutions modulo the modulus",
    },
  },
  required: ["solvable", "residue", "period", "multiplicity"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://math.libretexts.org/Courses/Mount_Royal_University/Higher_Arithmetic/4%3A_Greatest_Common_Divisor_least_common_multiple_and_Euclidean_Algorithm/4.5%3A_Linear_Congruences
export const calculateLinearCongruenceSolution = (rawInput: unknown): ToolResult<LinearCongruenceSolutionOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly a?: unknown;
    readonly b?: unknown;
    readonly modulus?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["a", "b", "modulus"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const aValue = candidate.a;
  if (typeof aValue !== "string")
    return issue("a", "invalid_type", "Enter an integer as a decimal string.");
  if (aValue.length > 200)
    return issue("a", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(aValue))
    return issue("a", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const bValue = candidate.b;
  if (typeof bValue !== "string")
    return issue("b", "invalid_type", "Enter an integer as a decimal string.");
  if (bValue.length > 200)
    return issue("b", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^-?(0|[1-9][0-9]*)$/.test(bValue))
    return issue("b", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const modulusValue = candidate.modulus;
  if (typeof modulusValue !== "string")
    return issue("modulus", "invalid_type", "Enter an integer as a decimal string.");
  if (modulusValue.length > 200)
    return issue("modulus", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^[1-9][0-9]*$/.test(modulusValue))
    return issue("modulus", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: LinearCongruenceSolutionInput = { a: aValue, b: bValue, modulus: modulusValue };
  const modulus = BigInt(input.modulus), b = BigInt(input.b);
  const result = extendedEuclid(BigInt(input.a), modulus);
  if (b % result.gcd !== 0n) return toolSuccess({ solvable: false, residue: "0", period: "0", multiplicity: "0" });
  const period = modulus / result.gcd;
  const residue = ((result.x * (b / result.gcd)) % period + period) % period;
  return toolSuccess({ solvable: true, residue: residue.toString(), period: period.toString(), multiplicity: result.gcd.toString() });
};

export const example = {
  input: {
    a: "14",
    b: "30",
    modulus: "100",
  },
  output: {
    solvable: true,
    residue: "45",
    period: "50",
    multiplicity: "2",
  },
} satisfies ToolExample<LinearCongruenceSolutionInput, LinearCongruenceSolutionOutput>;

export const linearCongruenceSolutionTool = defineTool<LinearCongruenceSolutionInput, LinearCongruenceSolutionOutput>({
  id: "math/linear-congruence-solution",
  title: "Linear Congruence Solver",
  description: "Solve a·x≡b (mod m) exactly, returning a residue, solution period, and number of residues modulo m; unsatisfiable equations return zero certificate fields.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: linearCongruenceSolutionInputSchema,
  outputSchema: linearCongruenceSolutionOutputSchema,
  ports: {
    inputs: [
      {
        id: "a",
        label: "Signed coefficient",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "b",
        label: "Signed right-hand side",
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
        id: "solvable",
        label: "Whether the congruence has a solution",
        valueType: {
          type: "boolean",
        },
      },
      {
        id: "residue",
        label: "Least nonnegative solution",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "period",
        label: "Period of all solutions",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
      {
        id: "multiplicity",
        label: "Number of solutions modulo the modulus",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateLinearCongruenceSolution,
});
export const runLinearCongruenceSolution = linearCongruenceSolutionTool.execute;
export default linearCongruenceSolutionTool;
