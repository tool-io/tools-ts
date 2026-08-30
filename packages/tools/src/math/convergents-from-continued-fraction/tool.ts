import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ConvergentsFromContinuedFractionInput = {
  readonly coefficients: ReadonlyArray<number>;
};
export type ConvergentsFromContinuedFractionOutput = {
  readonly convergents: ReadonlyArray<{ readonly numerator: string; readonly denominator: string; }>;
};

export const convergentsFromContinuedFractionInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: {
      type: "array",
      items: {
        type: "integer",
        minimum: -9007199254740991,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 256,
      description: "Simple continued fraction coefficients",
    },
  },
  required: ["coefficients"],
} as const satisfies ToolJsonSchema;
export const convergentsFromContinuedFractionOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convergents: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: {
            type: "string",
            pattern: "^-?(0|[1-9][0-9]*)$",
          },
          denominator: {
            type: "string",
            pattern: "^[1-9][0-9]*$",
          },
        },
        required: ["numerator", "denominator"],
      },
      description: "Rational convergents in prefix order",
    },
  },
  required: ["convergents"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://dlmf.nist.gov/1.12
export const calculateConvergentsFromContinuedFraction = (rawInput: unknown): ToolResult<ConvergentsFromContinuedFractionOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly coefficients?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["coefficients"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const coefficientsValue = candidate.coefficients;
  if (!Array.isArray(coefficientsValue))
    return issue("coefficients", "invalid_type", "Enter a dense array.");
  if (coefficientsValue.length < 1)
    return issue("coefficients", "out_of_range", "Array needs at least 1 entries.");
  if (coefficientsValue.length > 256)
    return issue("coefficients", "resource_limit", "Array exceeds the 256-entry resource limit.");
  const validatedCoefficients: number[] = [];
  for (let index = 0; index < coefficientsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(coefficientsValue, index))
      return issue(`coefficients.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = coefficientsValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item))
      return issue(`coefficients.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < -9007199254740991)
      return issue(`coefficients.${index}`, "out_of_range", "Value must be at least -9007199254740991.");
    if (item > 9007199254740991)
      return issue(`coefficients.${index}`, "out_of_range", "Value must be at most 9007199254740991.");
    validatedCoefficients.push(item);
  }
  const input: ConvergentsFromContinuedFractionInput = { coefficients: validatedCoefficients };
  for (let index = 1; index < input.coefficients.length; index++) {
    const coefficient = input.coefficients[index];
    if (coefficient === undefined || coefficient <= 0) return issue(`coefficients.${index}`, "invalid_coefficient", "Coefficients after the first must be positive.");
  }
  let previousNumerator = 0n, numerator = 1n, previousDenominator = 1n, denominator = 0n;
  const convergents: { numerator: string; denominator: string }[] = [];
  for (const coefficient of input.coefficients) {
    const a = BigInt(coefficient);
    [previousNumerator, numerator] = [numerator, a * numerator + previousNumerator];
    [previousDenominator, denominator] = [denominator, a * denominator + previousDenominator];
    convergents.push({ numerator: numerator.toString(), denominator: denominator.toString() });
  }
  return toolSuccess({ convergents });
};

export const example = {
  input: {
    coefficients: [3, 7, 16],
  },
  output: {
    convergents: [
      {
        numerator: "3",
        denominator: "1",
      },
      {
        numerator: "22",
        denominator: "7",
      },
      {
        numerator: "355",
        denominator: "113",
      },
    ],
  },
} satisfies ToolExample<ConvergentsFromContinuedFractionInput, ConvergentsFromContinuedFractionOutput>;

export const convergentsFromContinuedFractionTool = defineTool<ConvergentsFromContinuedFractionInput, ConvergentsFromContinuedFractionOutput>({
  id: "math/convergents-from-continued-fraction",
  title: "Continued Fraction Convergents",
  description: "Build all exact rational convergents of a finite simple continued fraction with an integral first coefficient and positive remaining coefficients.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: convergentsFromContinuedFractionInputSchema,
  outputSchema: convergentsFromContinuedFractionOutputSchema,
  ports: {
    inputs: [
      {
        id: "coefficients",
        label: "Simple continued fraction coefficients",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
    outputs: [
      {
        id: "convergents",
        label: "Rational convergents in prefix order",
        valueType: {
          type: "list",
          items: {
            type: "object",
          },
        },
      },
    ],
  },
  execute: calculateConvergentsFromContinuedFraction,
});
export const runConvergentsFromContinuedFraction = convergentsFromContinuedFractionTool.execute;
export default convergentsFromContinuedFractionTool;
