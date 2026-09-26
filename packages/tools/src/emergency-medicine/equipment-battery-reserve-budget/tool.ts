import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly observedUse: number;
  readonly reserved: number;
  readonly lossAdjustment: number;
};
export type Output = {
  readonly remaining: number;
  readonly unreserved: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number", minimum: 0 },
    observedUse: { type: "number", minimum: 0 },
    reserved: { type: "number", minimum: 0 },
    lossAdjustment: { type: "number", minimum: 0 },
  },
  required: ["capacity", "observedUse", "reserved", "lossAdjustment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" }, unreserved: { type: "number" } },
  required: ["remaining", "unreserved"],
} as const;
/** Supplied equipment inventory budget, without certifying readiness or predicting battery performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, observedUse, reserved, lossAdjustment } = request;
  const compute = (): Output => {
    H.domain(
      capacity >= 0 && observedUse >= 0 && reserved >= 0 && lossAdjustment >= 0,
    );
    return {
      remaining: capacity - observedUse - lossAdjustment,
      unreserved: capacity - observedUse - lossAdjustment - reserved,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 100, observedUse: 30, reserved: 20, lossAdjustment: 5 },
  output: { remaining: 65, unreserved: 45 },
} satisfies ToolExample<Input, Output>;
export const equipmentBatteryReserveBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/equipment-battery-reserve-budget",
    title: "Equipment Battery Reserve Budget Tool",
    description:
      "Supplied equipment inventory budget, without certifying readiness or predicting battery performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number", minimum: 0 },
        observedUse: { type: "number", minimum: 0 },
        reserved: { type: "number", minimum: 0 },
        lossAdjustment: { type: "number", minimum: 0 },
      },
      required: ["capacity", "observedUse", "reserved", "lossAdjustment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        unreserved: { type: "number" },
      },
      required: ["remaining", "unreserved"],
    },
    ports: {
      inputs: [
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedUse",
          label: "Observed Use",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossAdjustment",
          label: "Loss Adjustment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "unreserved",
          label: "Unreserved",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = equipmentBatteryReserveBudgetTool.execute;
export default equipmentBatteryReserveBudgetTool;
