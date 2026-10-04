import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coefficientText: string };
export type Output = {
  readonly fractionDigits: number;
  readonly exponent: number;
  readonly effectiveDecimalScale: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coefficientText: { type: "string", maxLength: 8192 } },
  required: ["coefficientText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionDigits: { type: "integer" },
    exponent: { type: "integer" },
    effectiveDecimalScale: { type: "integer" },
  },
  required: ["fractionDigits", "exponent", "effectiveDecimalScale"],
} as const;
/** Describe the written decimal scale of one polynomial coefficient, preserving trailing fractional zeros and accounting for its explicit exponent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficientText } = request;
  const compute = (): Output => {
    const match = /^[+-]?(?:\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?(?![\s\S])/.exec(
      coefficientText,
    );
    H.domain(match, "coefficientText");
    const fractionDigits = (match[1] ?? "").length;
    const exponent = Number(match[2] ?? 0);
    H.integer(exponent, -10000, 10000);
    return {
      fractionDigits,
      exponent,
      effectiveDecimalScale: fractionDigits - exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coefficientText: "-12.3400e-2" },
  output: { fractionDigits: 4, exponent: -2, effectiveDecimalScale: 6 },
} satisfies ToolExample<Input, Output>;
export const polynomialCoefficientDecimalScaleLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "algebra/polynomial-coefficient-decimal-scale-label",
      title: "Polynomial Coefficient Decimal Scale Label Tool",
      description:
        "Describe the written decimal scale of one polynomial coefficient, preserving trailing fractional zeros and accounting for its explicit exponent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { coefficientText: { type: "string", maxLength: 8192 } },
        required: ["coefficientText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fractionDigits: { type: "integer" },
          exponent: { type: "integer" },
          effectiveDecimalScale: { type: "integer" },
        },
        required: ["fractionDigits", "exponent", "effectiveDecimalScale"],
      },
      ports: {
        inputs: [
          {
            id: "coefficientText",
            label: "Coefficient Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "fractionDigits",
            label: "Fraction Digits",
            valueType: { type: "integer" },
          },
          { id: "exponent", label: "Exponent", valueType: { type: "integer" } },
          {
            id: "effectiveDecimalScale",
            label: "Effective Decimal Scale",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = polynomialCoefficientDecimalScaleLabelTool.execute;
export default polynomialCoefficientDecimalScaleLabelTool;
