import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coefficients: readonly number[] };
export type Output = { readonly coefficients: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["coefficients"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["coefficients"],
} as const;
/** Calculate monic polynomial coefficient scale from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coefficients } = input;
  const compute = (): Output => {
    H.domain(coefficients.length > 0 && coefficients[0] !== 0);
    return { coefficients: coefficients.map((x) => x / coefficients[0]) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coefficients: [2, 4, 6] },
  output: { coefficients: [1, 2, 3] },
} satisfies ToolExample<Input, Output>;
export const monicPolynomialCoefficientScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/monic-polynomial-coefficient-scale",
    title: "Monic Polynomial Coefficient Scale Tool",
    description:
      "Calculate monic polynomial coefficient scale from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficients: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["coefficients"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficients: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["coefficients"],
    },
    ports: {
      inputs: [
        {
          id: "coefficients",
          label: "Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "coefficients",
          label: "Coefficients",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = monicPolynomialCoefficientScaleTool.execute;
export default monicPolynomialCoefficientScaleTool;
