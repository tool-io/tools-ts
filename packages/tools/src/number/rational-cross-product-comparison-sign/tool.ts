import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstNumeratorDecimal: string;
  readonly firstDenominatorDecimal: string;
  readonly secondNumeratorDecimal: string;
  readonly secondDenominatorDecimal: string;
};
export type Output = { readonly comparison: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNumeratorDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    firstDenominatorDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    secondNumeratorDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    secondDenominatorDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: [
    "firstNumeratorDecimal",
    "firstDenominatorDecimal",
    "secondNumeratorDecimal",
    "secondDenominatorDecimal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { comparison: { type: "integer" } },
  required: ["comparison"],
} as const;
/** Compare two explicit integer-text rationals exactly with denominator-sign correction and no floating-point conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstNumeratorDecimal,
    firstDenominatorDecimal,
    secondNumeratorDecimal,
    secondDenominatorDecimal,
  } = request;
  const compute = (): Output => {
    const namedDecimal = (value: string, field: string): bigint => {
      H.domain(/^[+-]?\d{1,128}(?![\s\S])/.test(value), field);
      return BigInt(value);
    };
    return {
      comparison: (() => {
        const a = namedDecimal(firstNumeratorDecimal, "firstNumeratorDecimal"),
          b = namedDecimal(firstDenominatorDecimal, "firstDenominatorDecimal"),
          c = namedDecimal(secondNumeratorDecimal, "secondNumeratorDecimal"),
          d = namedDecimal(
            secondDenominatorDecimal,
            "secondDenominatorDecimal",
          );
        H.domain(b !== 0n, "firstDenominatorDecimal");
        H.domain(d !== 0n, "secondDenominatorDecimal");
        const cross = (a * d - c * b) * (b * d < 0n ? -1n : 1n);
        return cross < 0n ? -1 : cross > 0n ? 1 : 0;
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstNumeratorDecimal: "1",
    firstDenominatorDecimal: "2",
    secondNumeratorDecimal: "2",
    secondDenominatorDecimal: "3",
  },
  output: { comparison: -1 },
} satisfies ToolExample<Input, Output>;
export const rationalCrossProductComparisonSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["number", "mathematics"],
      keywords: ["number", "mathematics"],
    },
    id: "number/rational-cross-product-comparison-sign",
    title: "Rational Cross Product Comparison Sign",
    description:
      "Compare two explicit integer-text rationals exactly with denominator-sign correction and no floating-point conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstNumeratorDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        firstDenominatorDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        secondNumeratorDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        secondDenominatorDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: [
        "firstNumeratorDecimal",
        "firstDenominatorDecimal",
        "secondNumeratorDecimal",
        "secondDenominatorDecimal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { comparison: { type: "integer" } },
      required: ["comparison"],
    },
    ports: {
      inputs: [
        {
          id: "firstNumeratorDecimal",
          label: "First Numerator Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "firstDenominatorDecimal",
          label: "First Denominator Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "secondNumeratorDecimal",
          label: "Second Numerator Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "secondDenominatorDecimal",
          label: "Second Denominator Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "comparison",
          label: "Comparison",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = rationalCrossProductComparisonSignTool.execute;
export default rationalCrossProductComparisonSignTool;
