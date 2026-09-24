import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { binomial } from "../../math/pascal-row/tool.js";
export type Input = { readonly left: number; readonly right: number };
export type Output = { readonly factor: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "integer", minimum: 0, maximum: 128 },
    right: { type: "integer", minimum: 0, maximum: 128 },
  },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "string", maxLength: 8192 } },
  required: ["factor"],
} as const;
/** Compute multinomial category merge factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    integer(left, 0, 128);
    integer(right, 0, 128);
    domain(left + right <= 256);
    return { factor: binomial(left + right, left).toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 2, right: 3 },
  output: { factor: "10" },
} satisfies ToolExample<Input, Output>;
export const multinomialCategoryMergeFactorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/multinomial-category-merge-factor",
  title: "Multinomial Category Merge Factor Tool",
  description:
    "Compute multinomial category merge factor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "factor", label: "Factor", valueType: { type: "string" } }],
  },
});
export const run = multinomialCategoryMergeFactorTool.execute;
export default multinomialCategoryMergeFactorTool;
