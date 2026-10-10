import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledMinutes: number;
  readonly setupReservedMinutes: number;
};
export type Output = { readonly productionAvailableMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledMinutes: { type: "number", minimum: 0 },
    setupReservedMinutes: { type: "number", minimum: 0 },
  },
  required: ["scheduledMinutes", "setupReservedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { productionAvailableMinutes: { type: "number" } },
  required: ["productionAvailableMinutes"],
} as const;
/** Subtract explicit setup-reserved time from scheduled capacity, preserving over-reservation discrepancies without calculating output. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledMinutes, setupReservedMinutes } = request;
  const compute = (): Output => {
    H.domain(scheduledMinutes >= 0, "scheduledMinutes");
    H.domain(setupReservedMinutes >= 0, "setupReservedMinutes");
    return {
      productionAvailableMinutes: scheduledMinutes - setupReservedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledMinutes: 480, setupReservedMinutes: 60 },
  output: { productionAvailableMinutes: 420 },
} satisfies ToolExample<Input, Output>;
export const capacityPlanningSetupReservedMinuteTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-engineering/capacity-planning-setup-reserved-minute",
      title: "Capacity Planning Setup Reserved Minute Tool",
      description:
        "Subtract explicit setup-reserved time from scheduled capacity, preserving over-reservation discrepancies without calculating output.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scheduledMinutes: { type: "number", minimum: 0 },
          setupReservedMinutes: { type: "number", minimum: 0 },
        },
        required: ["scheduledMinutes", "setupReservedMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { productionAvailableMinutes: { type: "number" } },
        required: ["productionAvailableMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "scheduledMinutes",
            label: "Scheduled Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "setupReservedMinutes",
            label: "Setup Reserved Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "productionAvailableMinutes",
            label: "Production Available Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = capacityPlanningSetupReservedMinuteTool.execute;
export default capacityPlanningSetupReservedMinuteTool;
