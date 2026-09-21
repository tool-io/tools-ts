import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly ascendingCoefficients: readonly number[] };
export type Output = { readonly constant: number };
export const inputSchema = {
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
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { constant: { type: "number" } },
  required: ["constant"],
} as const;
/** Compute polynomial derivative constant coefficient from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { ascendingCoefficients } = input;
  const compute = (): Output => {
    domain(ascendingCoefficients.length > 0);
    return { constant: ascendingCoefficients[1] ?? 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { ascendingCoefficients: [4, 3, 2] },
  output: { constant: 3 },
} satisfies ToolExample<Input, Output>;
export const polynomialDerivativeConstantCoefficientTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/polynomial-derivative-constant-coefficient",
    title: "Polynomial Derivative Constant Coefficient Tool",
    description:
      "Compute polynomial derivative constant coefficient from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "ascendingCoefficients",
          label: "Ascending Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "constant", label: "Constant", valueType: { type: "number" } },
      ],
    },
  });
export const run = polynomialDerivativeConstantCoefficientTool.execute;
export default polynomialDerivativeConstantCoefficientTool;
