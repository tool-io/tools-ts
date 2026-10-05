import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly present: boolean;
  readonly weight: number;
  readonly zeroIsAbsent: boolean;
};
export type Output = { readonly edgeExists: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "boolean" },
    weight: { type: "number" },
    zeroIsAbsent: { type: "boolean" },
  },
  required: ["present", "weight", "zeroIsAbsent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { edgeExists: { type: "boolean" } },
  required: ["edgeExists"],
} as const;
/** Resolve one adjacency entry using explicit presence and zero-weight conventions. A zero-weight edge is retained unless the caller explicitly treats zero as absent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { present, weight, zeroIsAbsent } = request;
  const compute = (): Output => {
    return { edgeExists: present && (!zeroIsAbsent || weight !== 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { present: true, weight: 0, zeroIsAbsent: false },
  output: { edgeExists: true },
} satisfies ToolExample<Input, Output>;
export const adjacencyZeroVsAbsentPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/adjacency-zero-vs-absent-policy",
    title: "Adjacency Zero Vs Absent Policy Tool",
    description:
      "Resolve one adjacency entry using explicit presence and zero-weight conventions. A zero-weight edge is retained unless the caller explicitly treats zero as absent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        present: { type: "boolean" },
        weight: { type: "number" },
        zeroIsAbsent: { type: "boolean" },
      },
      required: ["present", "weight", "zeroIsAbsent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { edgeExists: { type: "boolean" } },
      required: ["edgeExists"],
    },
    ports: {
      inputs: [
        {
          id: "present",
          label: "Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroIsAbsent",
          label: "Zero Is Absent",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "edgeExists",
          label: "Edge Exists",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = adjacencyZeroVsAbsentPolicyTool.execute;
export default adjacencyZeroVsAbsentPolicyTool;
