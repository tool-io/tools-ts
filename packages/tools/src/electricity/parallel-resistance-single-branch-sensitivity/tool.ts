import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly equivalent: number; readonly branch: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalent: { type: "number", minimum: 0 },
    branch: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["equivalent", "branch"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Return the derivative of equivalent parallel resistance with respect to one positive branch resistance. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { equivalent, branch } = input;
  const compute = (): Output => {
    H.domain(equivalent >= 0);
    H.positive(branch);
    H.domain(equivalent <= branch);
    return { derivative: (equivalent / branch) ** 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { equivalent: 2, branch: 4 },
  output: { derivative: 0.25 },
} satisfies ToolExample<Input, Output>;
export const parallelResistanceSingleBranchSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/parallel-resistance-single-branch-sensitivity",
      title: "Parallel Resistance Single Branch Sensitivity Tool",
      description:
        "Return the derivative of equivalent parallel resistance with respect to one positive branch resistance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equivalent: { type: "number", minimum: 0 },
          branch: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["equivalent", "branch"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
      ports: {
        inputs: [
          {
            id: "equivalent",
            label: "Equivalent",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "branch",
            label: "Branch",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = parallelResistanceSingleBranchSensitivityTool.execute;
export default parallelResistanceSingleBranchSensitivityTool;
