import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly itemWeights: readonly number[];
  readonly packagingWeight: number;
};
export type Output = {
  readonly loadedWeight: number;
  readonly remainder: number;
  readonly utilization: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number", exclusiveMinimum: 0 },
    itemWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    packagingWeight: { type: "number", minimum: 0 },
  },
  required: ["capacity", "itemWeights", "packagingWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loadedWeight: { type: "number" },
    remainder: { type: "number" },
    utilization: { type: "number" },
  },
  required: ["loadedWeight", "remainder", "utilization"],
} as const;
/** Supplied shipment weight ledger retaining over-capacity residuals without transport-safety approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, itemWeights, packagingWeight } = request;
  const compute = (): Output => {
    H.positive(capacity);
    H.domain(itemWeights.every((x) => x >= 0) && packagingWeight >= 0);
    return {
      loadedWeight: itemWeights.reduce((a, b) => a + b, 0) + packagingWeight,
      remainder:
        capacity - itemWeights.reduce((a, b) => a + b, 0) - packagingWeight,
      utilization:
        (itemWeights.reduce((a, b) => a + b, 0) + packagingWeight) / capacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 100, itemWeights: [20, 30, 10], packagingWeight: 5 },
  output: { loadedWeight: 65, remainder: 35, utilization: 0.65 },
} satisfies ToolExample<Input, Output>;
export const shipmentFillWeightRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/shipment-fill-weight-remainder",
    title: "Shipment Fill Weight Remainder Tool",
    description:
      "Supplied shipment weight ledger retaining over-capacity residuals without transport-safety approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number", exclusiveMinimum: 0 },
        itemWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        packagingWeight: { type: "number", minimum: 0 },
      },
      required: ["capacity", "itemWeights", "packagingWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loadedWeight: { type: "number" },
        remainder: { type: "number" },
        utilization: { type: "number" },
      },
      required: ["loadedWeight", "remainder", "utilization"],
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
          id: "itemWeights",
          label: "Item Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "packagingWeight",
          label: "Packaging Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "loadedWeight",
          label: "Loaded Weight",
          valueType: { type: "number" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
        {
          id: "utilization",
          label: "Utilization",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shipmentFillWeightRemainderTool.execute;
export default shipmentFillWeightRemainderTool;
