import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly row: number;
  readonly column: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
  },
  required: ["vector", "row", "column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate vector normalization coordinate derivative from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { vector, row, column } = input;
  const compute = (): Output => {
    H.integer(row, 0, vector.length - 1);
    H.integer(column, 0, vector.length - 1);
    const norm = Math.hypot(...vector);
    H.positive(norm);
    return {
      derivative:
        ((row === column ? 1 : 0) -
          (vector[row] / norm) * (vector[column] / norm)) /
        norm,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vector: [3, 4], row: 0, column: 1 },
  output: { derivative: -0.096 },
} satisfies ToolExample<Input, Output>;
export const vectorNormalizationCoordinateDerivativeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-normalization-coordinate-derivative",
      title: "Vector Normalization Coordinate Derivative Tool",
      description:
        "Calculate vector normalization coordinate derivative from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vector: { type: "array", maxItems: 256, items: { type: "number" } },
          row: { type: "integer", minimum: 0 },
          column: { type: "integer", minimum: 0 },
        },
        required: ["vector", "row", "column"],
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
            id: "vector",
            label: "Vector",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "row",
            label: "Row",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "column",
            label: "Column",
            required: true,
            valueType: { type: "integer" },
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
export const run = vectorNormalizationCoordinateDerivativeTool.execute;
export default vectorNormalizationCoordinateDerivativeTool;
