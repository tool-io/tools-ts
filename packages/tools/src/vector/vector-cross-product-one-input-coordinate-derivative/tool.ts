import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly second: readonly number[];
  readonly coordinate: number;
};
export type Output = { readonly derivative: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    coordinate: { type: "integer", minimum: 0, maximum: 2 },
  },
  required: ["second", "coordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivative: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["derivative"],
} as const;
/** Calculate vector cross product one input coordinate derivative from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { second, coordinate } = input;
  const compute = (): Output => {
    H.domain(second.length === 3);
    H.integer(coordinate, 0, 2);
    const [a, b, c] = second;
    return {
      derivative:
        coordinate === 0
          ? [0, -c, b]
          : coordinate === 1
            ? [c, 0, -a]
            : [-b, a, 0],
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { second: [2, 3, 4], coordinate: 0 },
  output: { derivative: [0, -4, 3] },
} satisfies ToolExample<Input, Output>;
export const vectorCrossProductOneInputCoordinateDerivativeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-cross-product-one-input-coordinate-derivative",
      title: "Vector Cross Product One Input Coordinate Derivative Tool",
      description:
        "Calculate vector cross product one input coordinate derivative from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          second: { type: "array", maxItems: 256, items: { type: "number" } },
          coordinate: { type: "integer", minimum: 0, maximum: 2 },
        },
        required: ["second", "coordinate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          derivative: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["derivative"],
      },
      ports: {
        inputs: [
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "coordinate",
            label: "Coordinate",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorCrossProductOneInputCoordinateDerivativeTool.execute;
export default vectorCrossProductOneInputCoordinateDerivativeTool;
