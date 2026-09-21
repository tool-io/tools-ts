import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assignedWeights: readonly number[];
  readonly totalWeight: number;
};
export type Output = { readonly assigned: number; readonly unassigned: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    totalWeight: { type: "number", minimum: 0 },
  },
  required: ["assignedWeights", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { assigned: { type: "number" }, unassigned: { type: "number" } },
  required: ["assigned", "unassigned"],
} as const;
/** Preserve a signed allocation discrepancy without deciding authorship entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assignedWeights, totalWeight } = request;
  const compute = (): Output => {
    H.domain(assignedWeights.every((x) => x >= 0) && totalWeight >= 0);
    return {
      assigned: assignedWeights.reduce((a, b) => a + b, 0),
      unassigned: totalWeight - assignedWeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assignedWeights: [0.2, 0.3], totalWeight: 1 },
  output: { assigned: 0.5, unassigned: 0.5 },
} satisfies ToolExample<Input, Output>;
export const authorshipWeightUnassignedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/authorship-weight-unassigned-share",
    title: "Authorship Weight Unassigned Share Tool",
    description:
      "Preserve a signed allocation discrepancy without deciding authorship entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        totalWeight: { type: "number", minimum: 0 },
      },
      required: ["assignedWeights", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assigned: { type: "number" },
        unassigned: { type: "number" },
      },
      required: ["assigned", "unassigned"],
    },
    ports: {
      inputs: [
        {
          id: "assignedWeights",
          label: "Assigned Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "assigned", label: "Assigned", valueType: { type: "number" } },
        {
          id: "unassigned",
          label: "Unassigned",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorshipWeightUnassignedShareTool.execute;
export default authorshipWeightUnassignedShareTool;
