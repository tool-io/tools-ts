import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly determinant: number; readonly scale: number };
export type Output = { readonly determinant: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { determinant: { type: "number" }, scale: { type: "number" } },
  required: ["determinant", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { determinant: { type: "number" } },
  required: ["determinant"],
} as const;
/** Calculate matrix column scaling determinant factor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { determinant, scale } = input;
  const compute = (): Output => {
    return { determinant: determinant * scale };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { determinant: 6, scale: -2 },
  output: { determinant: -12 },
} satisfies ToolExample<Input, Output>;
export const matrixColumnScalingDeterminantFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "matrix/matrix-column-scaling-determinant-factor",
      title: "Matrix Column Scaling Determinant Factor Tool",
      description:
        "Calculate matrix column scaling determinant factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          determinant: { type: "number" },
          scale: { type: "number" },
        },
        required: ["determinant", "scale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { determinant: { type: "number" } },
        required: ["determinant"],
      },
      ports: {
        inputs: [
          {
            id: "determinant",
            label: "Determinant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "determinant",
            label: "Determinant",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = matrixColumnScalingDeterminantFactorTool.execute;
export default matrixColumnScalingDeterminantFactorTool;
