import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: readonly number[];
  readonly b: readonly number[];
  readonly c: readonly number[];
  readonly coordinate: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "array", maxItems: 256, items: { type: "number" } },
    b: { type: "array", maxItems: 256, items: { type: "number" } },
    c: { type: "array", maxItems: 256, items: { type: "number" } },
    coordinate: { type: "integer", minimum: 0, maximum: 2 },
  },
  required: ["a", "b", "c", "coordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
/** Calculate vector triple cross one coordinate from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, b, c, coordinate } = request;
  const compute = (): Output => {
    H.domain(a.length === 3 && b.length === 3 && c.length === 3);
    H.integer(coordinate, 0, 2);
    return { value: b[coordinate] * H.dot(a, c) - c[coordinate] * H.dot(a, b) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: [1, 2, 3], b: [4, 5, 6], c: [7, 8, 9], coordinate: 0 },
  output: { value: -24 },
} satisfies ToolExample<Input, Output>;
export const vectorTripleCrossOneCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-triple-cross-one-coordinate",
    title: "Vector Triple Cross One Coordinate Tool",
    description:
      "Calculate vector triple cross one coordinate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "array", maxItems: 256, items: { type: "number" } },
        b: { type: "array", maxItems: 256, items: { type: "number" } },
        c: { type: "array", maxItems: 256, items: { type: "number" } },
        coordinate: { type: "integer", minimum: 0, maximum: 2 },
      },
      required: ["a", "b", "c", "coordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "a",
          label: "A",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "b",
          label: "B",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "c",
          label: "C",
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
      outputs: [{ id: "value", label: "Value", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = vectorTripleCrossOneCoordinateTool.execute;
export default vectorTripleCrossOneCoordinateTool;
