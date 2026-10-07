import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedStock: number;
  readonly plantedStock: number;
  readonly returnedStock: number;
  readonly recordedLoss: number;
};
export type Output = { readonly unaccountedStock: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedStock: { type: "integer", minimum: 0 },
    plantedStock: { type: "integer", minimum: 0 },
    returnedStock: { type: "integer", minimum: 0 },
    recordedLoss: { type: "integer", minimum: 0 },
  },
  required: ["issuedStock", "plantedStock", "returnedStock", "recordedLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unaccountedStock: { type: "integer" } },
  required: ["unaccountedStock"],
} as const;
/** Reconcile issued restoration planting stock against explicit planted, returned and lost counts, preserving signed closure errors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedStock, plantedStock, returnedStock, recordedLoss } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(issuedStock) &&
        issuedStock >= 0 &&
        issuedStock <= Number.MAX_SAFE_INTEGER,
      "issuedStock",
    ),
      issuedStock);
    (H.domain(
      Number.isSafeInteger(plantedStock) &&
        plantedStock >= 0 &&
        plantedStock <= Number.MAX_SAFE_INTEGER,
      "plantedStock",
    ),
      plantedStock);
    (H.domain(
      Number.isSafeInteger(returnedStock) &&
        returnedStock >= 0 &&
        returnedStock <= Number.MAX_SAFE_INTEGER,
      "returnedStock",
    ),
      returnedStock);
    (H.domain(
      Number.isSafeInteger(recordedLoss) &&
        recordedLoss >= 0 &&
        recordedLoss <= Number.MAX_SAFE_INTEGER,
      "recordedLoss",
    ),
      recordedLoss);
    return {
      unaccountedStock:
        issuedStock - plantedStock - returnedStock - recordedLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    issuedStock: 100,
    plantedStock: 80,
    returnedStock: 10,
    recordedLoss: 5,
  },
  output: { unaccountedStock: 5 },
} satisfies ToolExample<Input, Output>;
export const restorationPlantingReturnedStockBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["conservation-biology", "conservation biology", "biology"],
        keywords: ["conservation biology", "biology"],
      },
      id: "conservation-biology/restoration-planting-returned-stock-balance",
      title: "Restoration Planting Returned Stock Balance",
      description:
        "Reconcile issued restoration planting stock against explicit planted, returned and lost counts, preserving signed closure errors.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issuedStock: { type: "integer", minimum: 0 },
          plantedStock: { type: "integer", minimum: 0 },
          returnedStock: { type: "integer", minimum: 0 },
          recordedLoss: { type: "integer", minimum: 0 },
        },
        required: [
          "issuedStock",
          "plantedStock",
          "returnedStock",
          "recordedLoss",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { unaccountedStock: { type: "integer" } },
        required: ["unaccountedStock"],
      },
      ports: {
        inputs: [
          {
            id: "issuedStock",
            label: "Issued Stock",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "plantedStock",
            label: "Planted Stock",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returnedStock",
            label: "Returned Stock",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "recordedLoss",
            label: "Recorded Loss",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unaccountedStock",
            label: "Unaccounted Stock",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = restorationPlantingReturnedStockBalanceTool.execute;
export default restorationPlantingReturnedStockBalanceTool;
