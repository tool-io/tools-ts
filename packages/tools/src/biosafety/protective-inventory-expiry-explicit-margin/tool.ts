import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiryDay: number;
  readonly plannedUseDay: number;
  readonly requiredRemainingDays: number;
};
export type Output = {
  readonly remainingDays: number;
  readonly marginDays: number;
  readonly meetsSuppliedMargin: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDay: { type: "integer" },
    plannedUseDay: { type: "integer" },
    requiredRemainingDays: { type: "integer", minimum: 0 },
  },
  required: ["expiryDay", "plannedUseDay", "requiredRemainingDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDays: { type: "integer" },
    marginDays: { type: "integer" },
    meetsSuppliedMargin: { type: "boolean" },
  },
  required: ["remainingDays", "marginDays", "meetsSuppliedMargin"],
} as const;
/** Compare supplied protective-inventory dates with an explicit required remaining-life margin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiryDay, plannedUseDay, requiredRemainingDays } = request;
  const compute = (): Output => {
    H.integer(requiredRemainingDays, 0);
    return {
      remainingDays: expiryDay - plannedUseDay,
      marginDays: expiryDay - plannedUseDay - requiredRemainingDays,
      meetsSuppliedMargin: expiryDay - plannedUseDay >= requiredRemainingDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expiryDay: 200, plannedUseDay: 180, requiredRemainingDays: 10 },
  output: { remainingDays: 20, marginDays: 10, meetsSuppliedMargin: true },
} satisfies ToolExample<Input, Output>;
export const protectiveInventoryExpiryExplicitMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/protective-inventory-expiry-explicit-margin",
      title: "Protective Inventory Expiry Explicit Margin Tool",
      description:
        "Compare supplied protective-inventory dates with an explicit required remaining-life margin.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expiryDay: { type: "integer" },
          plannedUseDay: { type: "integer" },
          requiredRemainingDays: { type: "integer", minimum: 0 },
        },
        required: ["expiryDay", "plannedUseDay", "requiredRemainingDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingDays: { type: "integer" },
          marginDays: { type: "integer" },
          meetsSuppliedMargin: { type: "boolean" },
        },
        required: ["remainingDays", "marginDays", "meetsSuppliedMargin"],
      },
      ports: {
        inputs: [
          {
            id: "expiryDay",
            label: "Expiry Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "plannedUseDay",
            label: "Planned Use Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "requiredRemainingDays",
            label: "Required Remaining Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "remainingDays",
            label: "Remaining Days",
            valueType: { type: "integer" },
          },
          {
            id: "marginDays",
            label: "Margin Days",
            valueType: { type: "integer" },
          },
          {
            id: "meetsSuppliedMargin",
            label: "Meets Supplied Margin",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = protectiveInventoryExpiryExplicitMarginTool.execute;
export default protectiveInventoryExpiryExplicitMarginTool;
