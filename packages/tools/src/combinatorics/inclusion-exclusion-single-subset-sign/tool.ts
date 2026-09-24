import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly subsetSize: number;
  readonly includeEmpty: boolean;
};
export type Output = { readonly coefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subsetSize: { type: "integer", minimum: 0 },
    includeEmpty: { type: "boolean" },
  },
  required: ["subsetSize", "includeEmpty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coefficient: { type: "integer" } },
  required: ["coefficient"],
} as const;
/** Compute inclusion exclusion single subset sign from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { subsetSize, includeEmpty } = input;
  const compute = (): Output => {
    integer(subsetSize);
    return {
      coefficient:
        subsetSize === 0 ? (includeEmpty ? 1 : 0) : subsetSize % 2 ? 1 : -1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { subsetSize: 3, includeEmpty: false },
  output: { coefficient: 1 },
} satisfies ToolExample<Input, Output>;
export const inclusionExclusionSingleSubsetSignTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/inclusion-exclusion-single-subset-sign",
  title: "Inclusion Exclusion Single Subset Sign Tool",
  description:
    "Compute inclusion exclusion single subset sign from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "subsetSize",
        label: "Subset Size",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "includeEmpty",
        label: "Include Empty",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "coefficient",
        label: "Coefficient",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = inclusionExclusionSingleSubsetSignTool.execute;
export default inclusionExclusionSingleSubsetSignTool;
