import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
  readonly weights: readonly number[];
};
export type Output = { readonly coordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    third: { type: "number" },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second", "third", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" } },
  required: ["coordinate"],
} as const;
/** Calculate vector three point barycentric coordinate term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, third, weights } = request;
  const compute = (): Output => {
    H.domain(
      weights.length === 3 &&
        Math.abs(weights.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
    );
    return {
      coordinate: first * weights[0] + second * weights[1] + third * weights[2],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 2, second: 6, third: 10, weights: [0.25, 0.5, 0.25] },
  output: { coordinate: 6 },
} satisfies ToolExample<Input, Output>;
export const vectorThreePointBarycentricCoordinateTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-three-point-barycentric-coordinate-term",
      title: "Vector Three Point Barycentric Coordinate Term Tool",
      description:
        "Calculate vector three point barycentric coordinate term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "number" },
          second: { type: "number" },
          third: { type: "number" },
          weights: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["first", "second", "third", "weights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { coordinate: { type: "number" } },
        required: ["coordinate"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "third",
            label: "Third",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weights",
            label: "Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "coordinate",
            label: "Coordinate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorThreePointBarycentricCoordinateTermTool.execute;
export default vectorThreePointBarycentricCoordinateTermTool;
