import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fractions: readonly number[];
  readonly totalMass: number;
};
export type Output = {
  readonly assignedMasses: readonly number[];
  readonly unassignedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractions: { type: "array", maxItems: 256, items: { type: "number" } },
    totalMass: { type: "number", minimum: 0 },
  },
  required: ["fractions", "totalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedMasses: { type: "array", maxItems: 256, items: { type: "number" } },
    unassignedMass: { type: "number" },
  },
  required: ["assignedMasses", "unassignedMass"],
} as const;
/** Supplied segment-fraction allocation, preserving signed over-allocation rather than selecting anatomical tables. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fractions, totalMass } = request;
  const compute = (): Output => {
    H.domain(totalMass >= 0 && fractions.every((x) => x >= 0 && x <= 1));
    return {
      assignedMasses: fractions.map((x) => x * totalMass),
      unassignedMass: totalMass * (1 - fractions.reduce((a, b) => a + b, 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fractions: [0.1, 0.2], totalMass: 80 },
  output: { assignedMasses: [8, 16], unassignedMass: 56 },
} satisfies ToolExample<Input, Output>;
export const segmentMassFractionBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/segment-mass-fraction-budget",
    title: "Segment Mass Fraction Budget Tool",
    description:
      "Supplied segment-fraction allocation, preserving signed over-allocation rather than selecting anatomical tables.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractions: { type: "array", maxItems: 256, items: { type: "number" } },
        totalMass: { type: "number", minimum: 0 },
      },
      required: ["fractions", "totalMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        unassignedMass: { type: "number" },
      },
      required: ["assignedMasses", "unassignedMass"],
    },
    ports: {
      inputs: [
        {
          id: "fractions",
          label: "Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "assignedMasses",
          label: "Assigned Masses",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unassignedMass",
          label: "Unassigned Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = segmentMassFractionBudgetTool.execute;
export default segmentMassFractionBudgetTool;
