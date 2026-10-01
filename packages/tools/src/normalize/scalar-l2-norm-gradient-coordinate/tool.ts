import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coordinate: number; readonly norm: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    norm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "norm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate scalar l2 norm gradient coordinate from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coordinate, norm } = input;
  const compute = (): Output => {
    H.positive(norm);
    H.domain(Math.abs(coordinate) <= norm);
    return { derivative: coordinate / norm };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinate: 3, norm: 5 },
  output: { derivative: 0.6 },
} satisfies ToolExample<Input, Output>;
export const scalarL2NormGradientCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/scalar-l2-norm-gradient-coordinate",
    title: "Scalar L2 Norm Gradient Coordinate Tool",
    description:
      "Calculate scalar l2 norm gradient coordinate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        norm: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coordinate", "norm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "norm",
          label: "Norm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scalarL2NormGradientCoordinateTool.execute;
export default scalarL2NormGradientCoordinateTool;
