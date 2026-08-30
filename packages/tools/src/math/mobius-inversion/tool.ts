import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MobiusInversionInput = {
  readonly divisorSums: ReadonlyArray<string>;
};
export type MobiusInversionOutput = {
  readonly values: ReadonlyArray<string>;
};

export const mobiusInversionInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    divisorSums: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
        maxLength: 200,
      },
      minItems: 0,
      maxItems: 1000,
      description: "Divisor sums F(1) through F(N)",
    },
  },
  required: ["divisorSums"],
} as const satisfies ToolJsonSchema;
export const mobiusInversionOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      items: {
        type: "string",
        pattern: "^-?(0|[1-9][0-9]*)$",
      },
      description: "Recovered arithmetic function f(1) through f(N)",
    },
  },
  required: ["values"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/27.5
export const calculateMobiusInversion = (rawInput: unknown): ToolResult<MobiusInversionOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly divisorSums?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["divisorSums"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const divisorSumsValue = candidate.divisorSums;
  if (!Array.isArray(divisorSumsValue))
    return issue("divisorSums", "invalid_type", "Enter a dense array.");
  if (divisorSumsValue.length < 0)
    return issue("divisorSums", "out_of_range", "Array needs at least 0 entries.");
  if (divisorSumsValue.length > 1000)
    return issue("divisorSums", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedDivisorSums: string[] = [];
  for (let index = 0; index < divisorSumsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(divisorSumsValue, index))
      return issue(`divisorSums.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = divisorSumsValue[index];
    if (typeof item !== "string")
      return issue(`divisorSums.${index}`, "invalid_type", "Enter an integer as a decimal string.");
    if (item.length > 200)
      return issue(`divisorSums.${index}`, "resource_limit", "Decimal input exceeds the 200-character resource limit.");
    if (!/^-?(0|[1-9][0-9]*)$/.test(item))
      return issue(`divisorSums.${index}`, "invalid_format", "Enter a canonical decimal integer with the required sign.");
    validatedDivisorSums.push(item);
  }
  const input: MobiusInversionInput = { divisorSums: validatedDivisorSums };
  const values = input.divisorSums.map((value) => BigInt(value));
  for (let divisor = 1; divisor <= values.length; divisor++) {
    const recovered = values[divisor - 1] ?? 0n;
    for (let multiple = 2 * divisor; multiple <= values.length; multiple += divisor) values[multiple - 1] = (values[multiple - 1] ?? 0n) - recovered;
  }
  return toolSuccess({ values: values.map((value) => value.toString()) });
};

export const example = {
  input: {
    divisorSums: ["1", "2", "3", "4", "5", "6"],
  },
  output: {
    values: ["1", "1", "2", "2", "4", "2"],
  },
} satisfies ToolExample<MobiusInversionInput, MobiusInversionOutput>;

export const mobiusInversionTool = defineTool<MobiusInversionInput, MobiusInversionOutput>({
  id: "math/mobius-inversion",
  title: "Möbius Inversion of Divisor Sums",
  description: "Recover f(1)…f(N) from F(n)=Σ(d|n)f(d) by exact triangular divisor-sum inversion; prefixes start at one and are capped at 1,000 entries.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: mobiusInversionInputSchema,
  outputSchema: mobiusInversionOutputSchema,
  ports: {
    inputs: [
      {
        id: "divisorSums",
        label: "Divisor sums F(1) through F(N)",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
            format: "integer/arbitrary",
          },
        },
      },
    ],
    outputs: [
      {
        id: "values",
        label: "Recovered arithmetic function f(1) through f(N)",
        valueType: {
          type: "list",
          items: {
            type: "string",
            format: "integer/arbitrary",
          },
        },
      },
    ],
  },
  execute: calculateMobiusInversion,
});
export const runMobiusInversion = mobiusInversionTool.execute;
export default mobiusInversionTool;
