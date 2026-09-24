import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly childSelected: boolean;
  readonly parentSelected: boolean;
};
export type Output = { readonly valid: boolean; readonly violation: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    childSelected: { type: "boolean" },
    parentSelected: { type: "boolean" },
  },
  required: ["childSelected", "parentSelected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, violation: { type: "boolean" } },
  required: ["valid", "violation"],
} as const;
/** Compute hierarchical label parent constraint pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { childSelected, parentSelected } = input;
  const compute = (): Output => {
    return {
      valid: !childSelected || parentSelected,
      violation: childSelected && !parentSelected,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { childSelected: true, parentSelected: false },
  output: { valid: false, violation: true },
} satisfies ToolExample<Input, Output>;
export const hierarchicalLabelParentConstraintPairTool =
  defineSchemaCalculation<Input, Output>({
    id: "classification/hierarchical-label-parent-constraint-pair",
    title: "Hierarchical Label Parent Constraint Pair Tool",
    description:
      "Compute hierarchical label parent constraint pair from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "childSelected",
          label: "Child Selected",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "parentSelected",
          label: "Parent Selected",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        { id: "violation", label: "Violation", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = hierarchicalLabelParentConstraintPairTool.execute;
export default hierarchicalLabelParentConstraintPairTool;
