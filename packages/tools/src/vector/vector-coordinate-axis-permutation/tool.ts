import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinates: readonly number[];
  readonly permutation: readonly number[];
};
export type Output = { readonly permuted: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
    permutation: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["coordinates", "permutation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permuted: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["permuted"],
} as const;
/** Permute a vector using an explicit zero-based destination-to-source axis permutation; the empty vector is allowed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinates, permutation } = request;
  const compute = (): Output => {
    H.sameLength(coordinates, permutation);
    H.domain(new Set(permutation).size === permutation.length, "permutation");
    permutation.forEach((v) => H.integer(v, 0, coordinates.length - 1));
    return { permuted: permutation.map((i) => coordinates[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinates: [10, 20, 30], permutation: [2, 0, 1] },
  output: { permuted: [30, 10, 20] },
} satisfies ToolExample<Input, Output>;
export const vectorCoordinateAxisPermutationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-coordinate-axis-permutation",
    title: "Vector Coordinate Axis Permutation Tool",
    description:
      "Permute a vector using an explicit zero-based destination-to-source axis permutation; the empty vector is allowed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        permutation: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["coordinates", "permutation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permuted: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["permuted"],
    },
    ports: {
      inputs: [
        {
          id: "coordinates",
          label: "Coordinates",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "permutation",
          label: "Permutation",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "permuted",
          label: "Permuted",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorCoordinateAxisPermutationTool.execute;
export default vectorCoordinateAxisPermutationTool;
