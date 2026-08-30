import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { factorPositiveInteger } from "../practical-number-checker/tool.js";
import { extendedEuclid } from "../extended-euclidean-coefficients/tool.js";

export type CarmichaelFunctionLambdaInput = {
  readonly n: number;
};
export type CarmichaelFunctionLambdaOutput = {
  readonly value: string;
};

export const carmichaelFunctionLambdaInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: {
      type: "integer",
      minimum: 1,
      maximum: 1000000000000,
      description: "Positive modulus (trial-division resource limit 10^12)",
    },
  },
  required: ["n"],
} as const satisfies ToolJsonSchema;
export const carmichaelFunctionLambdaOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      pattern: "^-?(0|[1-9][0-9]*)$",
      description: "Carmichael lambda value",
    },
  },
  required: ["value"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://oeis.org/wiki/Carmichael_function
export const calculateCarmichaelFunctionLambda = (rawInput: unknown): ToolResult<CarmichaelFunctionLambdaOutput> => {
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
  const input: CarmichaelFunctionLambdaInput = { n: nValue };
  let value = 1n;
  for (const { prime, exponent } of factorPositiveInteger(input.n)) {
    const p = BigInt(prime);
    const local = prime === 2 && exponent >= 3 ? 2n ** BigInt(exponent - 2) : p ** BigInt(exponent - 1) * (p - 1n);
    const { gcd } = extendedEuclid(value, local);
    value = value / gcd * local;
  }
  return toolSuccess({ value: value.toString() });
};

export const example = {
  input: {
    n: 72,
  },
  output: {
    value: "6",
  },
} satisfies ToolExample<CarmichaelFunctionLambdaInput, CarmichaelFunctionLambdaOutput>;

export const carmichaelFunctionLambdaTool = defineTool<CarmichaelFunctionLambdaInput, CarmichaelFunctionLambdaOutput>({
  id: "math/carmichael-function-lambda",
  title: "Carmichael Lambda Function",
  description: "Return the exponent of the multiplicative group modulo n exactly from prime powers and their lcm, with λ(1)=1 and trial division limited to n≤10¹².",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: carmichaelFunctionLambdaInputSchema,
  outputSchema: carmichaelFunctionLambdaOutputSchema,
  ports: {
    inputs: [
      {
        id: "n",
        label: "Positive modulus (trial-division resource limit 10^12)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Carmichael lambda value",
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
  },
  execute: calculateCarmichaelFunctionLambda,
});
export const runCarmichaelFunctionLambda = carmichaelFunctionLambdaTool.execute;
export default carmichaelFunctionLambdaTool;
