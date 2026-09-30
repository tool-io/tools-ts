import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = {
  readonly dot: number;
  readonly firstNormResidual: number;
  readonly secondNormResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    c: { type: "number" },
    d: { type: "number" },
  },
  required: ["a", "b", "c", "d"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dot: { type: "number" },
    firstNormResidual: { type: "number" },
    secondNormResidual: { type: "number" },
  },
  required: ["dot", "firstNormResidual", "secondNormResidual"],
} as const;
/** Compute matrix 2x2 orthogonal column residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { a, b, c, d } = input;
  const compute = (): Output => {
    return {
      dot: a * b + c * d,
      firstNormResidual: a * a + c * c - 1,
      secondNormResidual: b * b + d * d - 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 1, b: 0, c: 0, d: 1 },
  output: { dot: 0, firstNormResidual: 0, secondNormResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const matrix2x2OrthogonalColumnResidualTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-2x2-orthogonal-column-residual",
  title: "Matrix 2x2 Orthogonal Column Residual Tool",
  description:
    "Compute matrix 2x2 orthogonal column residual from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "a", label: "A", required: true, valueType: { type: "number" } },
      { id: "b", label: "B", required: true, valueType: { type: "number" } },
      { id: "c", label: "C", required: true, valueType: { type: "number" } },
      { id: "d", label: "D", required: true, valueType: { type: "number" } },
    ],
    outputs: [
      { id: "dot", label: "Dot", valueType: { type: "number" } },
      {
        id: "firstNormResidual",
        label: "First Norm Residual",
        valueType: { type: "number" },
      },
      {
        id: "secondNormResidual",
        label: "Second Norm Residual",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = matrix2x2OrthogonalColumnResidualTool.execute;
export default matrix2x2OrthogonalColumnResidualTool;
