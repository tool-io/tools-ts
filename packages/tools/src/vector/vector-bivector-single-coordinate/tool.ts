import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly i: number;
  readonly j: number;
};
export type Output = { readonly coordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    i: { type: "integer", minimum: 0 },
    j: { type: "integer", minimum: 0 },
  },
  required: ["first", "second", "i", "j"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" } },
  required: ["coordinate"],
} as const;
/** Calculate vector bivector single coordinate from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, i, j } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    H.integer(i, 0, first.length - 1);
    H.integer(j, 0, first.length - 1);
    H.domain(i !== j);
    return { coordinate: first[i] * second[j] - first[j] * second[i] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [1, 2, 3], second: [4, 5, 6], i: 0, j: 2 },
  output: { coordinate: -6 },
} satisfies ToolExample<Input, Output>;
export const vectorBivectorSingleCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-bivector-single-coordinate",
    title: "Vector Bivector Single Coordinate Tool",
    description:
      "Calculate vector bivector single coordinate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
        i: { type: "integer", minimum: 0 },
        j: { type: "integer", minimum: 0 },
      },
      required: ["first", "second", "i", "j"],
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
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "i", label: "I", required: true, valueType: { type: "integer" } },
        { id: "j", label: "J", required: true, valueType: { type: "integer" } },
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
export const run = vectorBivectorSingleCoordinateTool.execute;
export default vectorBivectorSingleCoordinateTool;
