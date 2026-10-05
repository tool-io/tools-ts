import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupAllocation: number;
  readonly totalAllocation: number;
};
export type Output = { readonly allocationShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupAllocation: { type: "number", minimum: 0 },
    totalAllocation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["groupAllocation", "totalAllocation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allocationShare: { type: "number" } },
  required: ["allocationShare"],
} as const;
/** Describe one group's recorded share of an allocated policy budget, rather than estimating economic incidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupAllocation, totalAllocation } = request;
  const compute = (): Output => {
    (H.domain(totalAllocation > 0, "totalAllocation"), totalAllocation);
    H.domain(
      groupAllocation >= 0 && groupAllocation <= totalAllocation,
      "groupAllocation",
    );
    return { allocationShare: groupAllocation / totalAllocation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupAllocation: 250, totalAllocation: 1000 },
  output: { allocationShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const policyBudgetLineIncidenceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-budget-line-incidence-share",
    title: "Policy Budget Line Incidence Share Tool",
    description:
      "Describe one group's recorded share of an allocated policy budget, rather than estimating economic incidence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupAllocation: { type: "number", minimum: 0 },
        totalAllocation: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["groupAllocation", "totalAllocation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allocationShare: { type: "number" } },
      required: ["allocationShare"],
    },
    ports: {
      inputs: [
        {
          id: "groupAllocation",
          label: "Group Allocation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalAllocation",
          label: "Total Allocation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocationShare",
          label: "Allocation Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyBudgetLineIncidenceShareTool.execute;
export default policyBudgetLineIncidenceShareTool;
