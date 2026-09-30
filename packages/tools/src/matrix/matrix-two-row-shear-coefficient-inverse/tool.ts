import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coefficient: number };
export type Output = { readonly inverseCoefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coefficient: { type: "number" } },
  required: ["coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inverseCoefficient: { type: "number" } },
  required: ["inverseCoefficient"],
} as const;
/** Calculate matrix two row shear coefficient inverse from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coefficient } = input;
  const compute = (): Output => {
    return { inverseCoefficient: -coefficient };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coefficient: 3 },
  output: { inverseCoefficient: -3 },
} satisfies ToolExample<Input, Output>;
export const matrixTwoRowShearCoefficientInverseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "matrix/matrix-two-row-shear-coefficient-inverse",
      title: "Matrix Two Row Shear Coefficient Inverse Tool",
      description:
        "Calculate matrix two row shear coefficient inverse from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { coefficient: { type: "number" } },
        required: ["coefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { inverseCoefficient: { type: "number" } },
        required: ["inverseCoefficient"],
      },
      ports: {
        inputs: [
          {
            id: "coefficient",
            label: "Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "inverseCoefficient",
            label: "Inverse Coefficient",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = matrixTwoRowShearCoefficientInverseTool.execute;
export default matrixTwoRowShearCoefficientInverseTool;
