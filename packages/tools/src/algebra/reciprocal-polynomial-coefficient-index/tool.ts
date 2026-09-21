import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly degree: number; readonly index: number };
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degree: { type: "integer", minimum: 0 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["degree", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" } },
  required: ["index"],
} as const;
/** Calculate reciprocal polynomial coefficient index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { degree, index } = input;
  const compute = (): Output => {
    H.integer(degree, 0);
    H.integer(index, 0, degree);
    return { index: degree - index };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { degree: 5, index: 2 },
  output: { index: 3 },
} satisfies ToolExample<Input, Output>;
export const reciprocalPolynomialCoefficientIndexTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "algebra/reciprocal-polynomial-coefficient-index",
      title: "Reciprocal Polynomial Coefficient Index Tool",
      description:
        "Calculate reciprocal polynomial coefficient index from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: { type: "integer", minimum: 0 },
          index: { type: "integer", minimum: 0 },
        },
        required: ["degree", "index"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { index: { type: "integer" } },
        required: ["index"],
      },
      ports: {
        inputs: [
          {
            id: "degree",
            label: "Degree",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "index",
            label: "Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "index", label: "Index", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = reciprocalPolynomialCoefficientIndexTool.execute;
export default reciprocalPolynomialCoefficientIndexTool;
