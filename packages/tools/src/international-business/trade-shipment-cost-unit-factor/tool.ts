import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCost: number;
  readonly quantity: number;
  readonly targetUnits: number;
};
export type Output = { readonly costPerTargetUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCost: { type: "number" },
    quantity: { type: "number", exclusiveMinimum: 0 },
    targetUnits: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalCost", "quantity", "targetUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { costPerTargetUnits: { type: "number" } },
  required: ["costPerTargetUnits"],
} as const;
/** Calculate trade shipment cost unit factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCost, quantity, targetUnits } = request;
  const compute = (): Output => {
    H.positive(quantity);
    H.positive(targetUnits);
    return { costPerTargetUnits: (totalCost / quantity) * targetUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalCost: 120, quantity: 30, targetUnits: 10 },
  output: { costPerTargetUnits: 40 },
} satisfies ToolExample<Input, Output>;
export const tradeShipmentCostUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/trade-shipment-cost-unit-factor",
    title: "Trade Shipment Cost Unit Factor Tool",
    description:
      "Calculate trade shipment cost unit factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCost: { type: "number" },
        quantity: { type: "number", exclusiveMinimum: 0 },
        targetUnits: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["totalCost", "quantity", "targetUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { costPerTargetUnits: { type: "number" } },
      required: ["costPerTargetUnits"],
    },
    ports: {
      inputs: [
        {
          id: "totalCost",
          label: "Total Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetUnits",
          label: "Target Units",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "costPerTargetUnits",
          label: "Cost Per Target Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tradeShipmentCostUnitFactorTool.execute;
export default tradeShipmentCostUnitFactorTool;
