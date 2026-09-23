import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly permutation: readonly number[];
  readonly position: number;
};
export type Output = { readonly inverse: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permutation: { type: "array", maxItems: 256, items: { type: "integer" } },
    position: { type: "integer", minimum: 0 },
  },
  required: ["permutation", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inverse: { type: "integer" } },
  required: ["inverse"],
} as const;
/** Calculate bit permutation inverse position from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { permutation, position } = input;
  const compute = (): Output => {
    H.domain(
      permutation.length > 0 &&
        new Set(permutation).size === permutation.length &&
        permutation.every((x) => x >= 0 && x < permutation.length),
    );
    H.integer(position, 0, permutation.length - 1);
    return { inverse: permutation.indexOf(position) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { permutation: [2, 0, 1], position: 0 },
  output: { inverse: 1 },
} satisfies ToolExample<Input, Output>;
export const bitPermutationInversePositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bit-permutation-inverse-position",
    title: "Bit Permutation Inverse Position Tool",
    description:
      "Calculate bit permutation inverse position from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permutation: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        position: { type: "integer", minimum: 0 },
      },
      required: ["permutation", "position"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inverse: { type: "integer" } },
      required: ["inverse"],
    },
    ports: {
      inputs: [
        {
          id: "permutation",
          label: "Permutation",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "inverse", label: "Inverse", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bitPermutationInversePositionTool.execute;
export default bitPermutationInversePositionTool;
