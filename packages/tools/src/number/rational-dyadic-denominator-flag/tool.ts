import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: string;
  readonly denominator: string;
};
export type Output = {
  readonly reducedDenominator: string;
  readonly dyadic: boolean;
  readonly exponent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "string", maxLength: 8192, format: "integer-decimal" },
    denominator: { type: "string", maxLength: 8192, format: "integer-decimal" },
  },
  required: ["numerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reducedDenominator: { type: "string", maxLength: 8192 },
    dyadic: { type: "boolean" },
    exponent: { type: "integer" },
  },
  required: ["reducedDenominator", "dyadic", "exponent"],
} as const;
/** Reduce a supplied exact rational before testing whether its denominator is a power of two. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator } = request;
  const compute = (): Output => {
    let n = H.decimal(numerator),
      d = H.decimal(denominator);
    H.domain(d !== 0n, "denominator");
    if (n < 0n) n = -n;
    if (d < 0n) d = -d;
    let a = n,
      b = d;
    while (b !== 0n) {
      const r = a % b;
      a = b;
      b = r;
    }
    d /= a;
    const reducedDenominator = d.toString();
    let exponent = 0;
    while (d > 1n && d % 2n === 0n) {
      d /= 2n;
      exponent++;
    }
    return {
      reducedDenominator,
      dyadic: d === 1n,
      exponent: d === 1n ? exponent : -1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: "6", denominator: "24" },
  output: { reducedDenominator: "4", dyadic: true, exponent: 2 },
} satisfies ToolExample<Input, Output>;
export const rationalDyadicDenominatorFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/rational-dyadic-denominator-flag",
    title: "Rational Dyadic Denominator Flag Tool",
    description:
      "Reduce a supplied exact rational before testing whether its denominator is a power of two.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        denominator: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["numerator", "denominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reducedDenominator: { type: "string", maxLength: 8192 },
        dyadic: { type: "boolean" },
        exponent: { type: "integer" },
      },
      required: ["reducedDenominator", "dyadic", "exponent"],
    },
    ports: {
      inputs: [
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "reducedDenominator",
          label: "Reduced Denominator",
          valueType: { type: "string" },
        },
        { id: "dyadic", label: "Dyadic", valueType: { type: "boolean" } },
        { id: "exponent", label: "Exponent", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = rationalDyadicDenominatorFlagTool.execute;
export default rationalDyadicDenominatorFlagTool;
