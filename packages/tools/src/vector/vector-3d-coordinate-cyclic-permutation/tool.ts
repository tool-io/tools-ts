import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly shift: number;
};
export type Output = { readonly vector: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    shift: { type: "integer" },
  },
  required: ["vector", "shift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["vector"],
} as const;
/** Calculate vector 3d coordinate cyclic permutation from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { vector, shift } = input;
  const compute = (): Output => {
    H.domain(vector.length === 3);
    const k = H.mod(shift, 3);
    return { vector: [vector[k], vector[(k + 1) % 3], vector[(k + 2) % 3]] };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vector: [1, 2, 3], shift: 1 },
  output: { vector: [2, 3, 1] },
} satisfies ToolExample<Input, Output>;
export const vector3dCoordinateCyclicPermutationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-3d-coordinate-cyclic-permutation",
      title: "Vector 3d Coordinate Cyclic Permutation Tool",
      description:
        "Calculate vector 3d coordinate cyclic permutation from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vector: { type: "array", maxItems: 256, items: { type: "number" } },
          shift: { type: "integer" },
        },
        required: ["vector", "shift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vector: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["vector"],
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
            id: "shift",
            label: "Shift",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "vector",
            label: "Vector",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = vector3dCoordinateCyclicPermutationTool.execute;
export default vector3dCoordinateCyclicPermutationTool;
