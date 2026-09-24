import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly items: number;
  readonly labeledRotation: boolean;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: { type: "integer", minimum: 1 },
    labeledRotation: { type: "boolean" },
  },
  required: ["items", "labeledRotation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "integer" } },
  required: ["factor"],
} as const;
/** Compute circular permutation anchor factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { items, labeledRotation } = input;
  const compute = (): Output => {
    integer(items, 1);
    return { factor: labeledRotation ? items : 1 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { items: 5, labeledRotation: true },
  output: { factor: 5 },
} satisfies ToolExample<Input, Output>;
export const circularPermutationAnchorFactorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/circular-permutation-anchor-factor",
  title: "Circular Permutation Anchor Factor Tool",
  description:
    "Compute circular permutation anchor factor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "items",
        label: "Items",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "labeledRotation",
        label: "Labeled Rotation",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "factor", label: "Factor", valueType: { type: "integer" } },
    ],
  },
});
export const run = circularPermutationAnchorFactorTool.execute;
export default circularPermutationAnchorFactorTool;
