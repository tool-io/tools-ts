import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly productCoordinate: number;
  readonly squaredNorm: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    productCoordinate: { type: "number" },
    squaredNorm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "productCoordinate", "squaredNorm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate matrix rayleigh one coordinate term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coordinate, productCoordinate, squaredNorm } = input;
  const compute = (): Output => {
    H.positive(squaredNorm);
    return { contribution: (coordinate * productCoordinate) / squaredNorm };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinate: 2, productCoordinate: 6, squaredNorm: 4 },
  output: { contribution: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixRayleighOneCoordinateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-rayleigh-one-coordinate-term",
    title: "Matrix Rayleigh One Coordinate Term Tool",
    description:
      "Calculate matrix rayleigh one coordinate term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        productCoordinate: { type: "number" },
        squaredNorm: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coordinate", "productCoordinate", "squaredNorm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
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
          id: "productCoordinate",
          label: "Product Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "squaredNorm",
          label: "Squared Norm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixRayleighOneCoordinateTermTool.execute;
export default matrixRayleighOneCoordinateTermTool;
