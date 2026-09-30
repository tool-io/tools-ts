import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly permutation: readonly number[];
  readonly index: number;
};
export type Output = { readonly diagonal: number; readonly fixed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permutation: { type: "array", maxItems: 256, items: { type: "integer" } },
    index: { type: "integer", minimum: 0 },
  },
  required: ["permutation", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diagonal: { type: "integer" }, fixed: { type: "boolean" } },
  required: ["diagonal", "fixed"],
} as const;
/** Compute matrix permutation fixed point entry from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { permutation, index } = input;
  const compute = (): Output => {
    domain(
      new Set(permutation).size === permutation.length &&
        permutation.every((x) => x >= 0 && x < permutation.length),
    );
    integer(index, 0, permutation.length - 1);
    const fixed = permutation[index] === index;
    return { diagonal: fixed ? 1 : 0, fixed };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { permutation: [1, 0, 2], index: 2 },
  output: { diagonal: 1, fixed: true },
} satisfies ToolExample<Input, Output>;
export const matrixPermutationFixedPointEntryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-permutation-fixed-point-entry",
  title: "Matrix Permutation Fixed Point Entry Tool",
  description:
    "Compute matrix permutation fixed point entry from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "permutation",
        label: "Permutation",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "diagonal", label: "Diagonal", valueType: { type: "integer" } },
      { id: "fixed", label: "Fixed", valueType: { type: "boolean" } },
    ],
  },
});
export const run = matrixPermutationFixedPointEntryTool.execute;
export default matrixPermutationFixedPointEntryTool;
