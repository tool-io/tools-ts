import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly realPart: number;
  readonly imaginaryPart: number;
};
export type Output = { readonly ascendingCoefficients: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realPart: { type: "number" },
    imaginaryPart: { type: "number" },
  },
  required: ["realPart", "imaginaryPart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ascendingCoefficients: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["ascendingCoefficients"],
} as const;
/** Compute complex conjugate root factor coefficients from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { realPart, imaginaryPart } = input;
  const compute = (): Output => {
    domain(imaginaryPart >= 0);
    return {
      ascendingCoefficients: [
        realPart ** 2 + imaginaryPart ** 2,
        -2 * realPart,
        1,
      ],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { realPart: 2, imaginaryPart: 3 },
  output: { ascendingCoefficients: [13, -4, 1] },
} satisfies ToolExample<Input, Output>;
export const complexConjugateRootFactorCoefficientsTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/complex-conjugate-root-factor-coefficients",
    title: "Complex Conjugate Root Factor Coefficients Tool",
    description:
      "Compute complex conjugate root factor coefficients from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "realPart",
          label: "Real Part",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imaginaryPart",
          label: "Imaginary Part",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ascendingCoefficients",
          label: "Ascending Coefficients",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  });
export const run = complexConjugateRootFactorCoefficientsTool.execute;
export default complexConjugateRootFactorCoefficientsTool;
