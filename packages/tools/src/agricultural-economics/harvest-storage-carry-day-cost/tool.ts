import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storedQuantity: number;
  readonly daysStored: number;
  readonly storageCostPerUnitDay: number;
};
export type Output = { readonly carryingCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storedQuantity: { type: "number", minimum: 0 },
    daysStored: { type: "integer", minimum: 0 },
    storageCostPerUnitDay: { type: "number", minimum: 0 },
  },
  required: ["storedQuantity", "daysStored", "storageCostPerUnitDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { carryingCost: { type: "number" } },
  required: ["carryingCost"],
} as const;
/** Extend a constant-quantity harvest storage carrying charge from an explicit unit-day cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storedQuantity, daysStored, storageCostPerUnitDay } = request;
  const compute = (): Output => {
    H.domain(
      storedQuantity >= 0 && storageCostPerUnitDay >= 0,
      "storedQuantity",
    );
    (H.domain(
      Number.isSafeInteger(daysStored) &&
        daysStored >= 0 &&
        daysStored <= Number.MAX_SAFE_INTEGER,
      "daysStored",
    ),
      daysStored);
    return {
      carryingCost: storedQuantity * daysStored * storageCostPerUnitDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storedQuantity: 100, daysStored: 30, storageCostPerUnitDay: 0.02 },
  output: { carryingCost: 60 },
} satisfies ToolExample<Input, Output>;
export const harvestStorageCarryDayCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/harvest-storage-carry-day-cost",
    title: "Harvest Storage Carry Day Cost",
    description:
      "Extend a constant-quantity harvest storage carrying charge from an explicit unit-day cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storedQuantity: { type: "number", minimum: 0 },
        daysStored: { type: "integer", minimum: 0 },
        storageCostPerUnitDay: { type: "number", minimum: 0 },
      },
      required: ["storedQuantity", "daysStored", "storageCostPerUnitDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { carryingCost: { type: "number" } },
      required: ["carryingCost"],
    },
    ports: {
      inputs: [
        {
          id: "storedQuantity",
          label: "Stored Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "daysStored",
          label: "Days Stored",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "storageCostPerUnitDay",
          label: "Storage Cost Per Unit Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "carryingCost",
          label: "Carrying Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = harvestStorageCarryDayCostTool.execute;
export default harvestStorageCarryDayCostTool;
