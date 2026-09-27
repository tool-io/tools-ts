import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentAge: number;
  readonly childAge: number;
  readonly branchDuration: number;
};
export type Output = {
  readonly impliedDuration: number;
  readonly residual: number;
  readonly consistentOrder: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentAge: { type: "number", minimum: 0 },
    childAge: { type: "number", minimum: 0 },
    branchDuration: { type: "number", minimum: 0 },
  },
  required: ["parentAge", "childAge", "branchDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impliedDuration: { type: "number" },
    residual: { type: "number" },
    consistentOrder: { type: "boolean" },
  },
  required: ["impliedDuration", "residual", "consistentOrder"],
} as const;
/** Ages are measured backward from the same present; inconsistent supplied node ordering remains an explicit flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentAge, childAge, branchDuration } = request;
  const compute = (): Output => {
    H.domain(parentAge >= 0 && childAge >= 0 && branchDuration >= 0);
    return {
      impliedDuration: parentAge - childAge,
      residual: parentAge - childAge - branchDuration,
      consistentOrder: parentAge >= childAge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentAge: 12, childAge: 5, branchDuration: 6 },
  output: { impliedDuration: 7, residual: 1, consistentOrder: true },
} satisfies ToolExample<Input, Output>;
export const phylogeneticNodeAgeBranchResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/phylogenetic-node-age-branch-residual",
    title: "Phylogenetic Node Age Branch Residual Tool",
    description:
      "Ages are measured backward from the same present; inconsistent supplied node ordering remains an explicit flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentAge: { type: "number", minimum: 0 },
        childAge: { type: "number", minimum: 0 },
        branchDuration: { type: "number", minimum: 0 },
      },
      required: ["parentAge", "childAge", "branchDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impliedDuration: { type: "number" },
        residual: { type: "number" },
        consistentOrder: { type: "boolean" },
      },
      required: ["impliedDuration", "residual", "consistentOrder"],
    },
    ports: {
      inputs: [
        {
          id: "parentAge",
          label: "Parent Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "childAge",
          label: "Child Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "branchDuration",
          label: "Branch Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "impliedDuration",
          label: "Implied Duration",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "consistentOrder",
          label: "Consistent Order",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = phylogeneticNodeAgeBranchResidualTool.execute;
export default phylogeneticNodeAgeBranchResidualTool;
