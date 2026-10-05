import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocatedHours: number;
  readonly capacityHours: number;
};
export type Output = {
  readonly excessHours: number;
  readonly utilizationFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedHours: { type: "number", minimum: 0 },
    capacityHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["allocatedHours", "capacityHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excessHours: { type: "number" },
    utilizationFraction: { type: "number" },
  },
  required: ["excessHours", "utilizationFraction"],
} as const;
/** Compare allocated work with positive available capacity for the same reporting interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocatedHours, capacityHours } = request;
  const compute = (): Output => {
    H.domain(allocatedHours >= 0, "allocatedHours");
    (H.domain(capacityHours > 0, "capacityHours"), capacityHours);
    return {
      excessHours: Math.max(0, allocatedHours - capacityHours),
      utilizationFraction: allocatedHours / capacityHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocatedHours: 45, capacityHours: 40 },
  output: { excessHours: 5, utilizationFraction: 1.125 },
} satisfies ToolExample<Input, Output>;
export const workloadAllocationOverCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/workload-allocation-over-capacity",
    title: "Workload Allocation Over Capacity Tool",
    description:
      "Compare allocated work with positive available capacity for the same reporting interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedHours: { type: "number", minimum: 0 },
        capacityHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["allocatedHours", "capacityHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excessHours: { type: "number" },
        utilizationFraction: { type: "number" },
      },
      required: ["excessHours", "utilizationFraction"],
    },
    ports: {
      inputs: [
        {
          id: "allocatedHours",
          label: "Allocated Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacityHours",
          label: "Capacity Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "excessHours",
          label: "Excess Hours",
          valueType: { type: "number" },
        },
        {
          id: "utilizationFraction",
          label: "Utilization Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = workloadAllocationOverCapacityTool.execute;
export default workloadAllocationOverCapacityTool;
