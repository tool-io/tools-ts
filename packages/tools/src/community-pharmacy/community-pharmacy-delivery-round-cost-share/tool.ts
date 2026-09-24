import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stopWeights: readonly number[];
  readonly totalRoundCost: number;
  readonly stopIndex: number;
};
export type Output = {
  readonly weightTotal: number;
  readonly allocatedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stopWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    totalRoundCost: { type: "number", minimum: 0 },
    stopIndex: { type: "integer", minimum: 0 },
  },
  required: ["stopWeights", "totalRoundCost", "stopIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightTotal: { type: "number" },
    allocatedCost: { type: "number" },
  },
  required: ["weightTotal", "allocatedCost"],
} as const;
/** Calculate community pharmacy delivery round cost share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stopWeights, totalRoundCost, stopIndex } = request;
  const compute = (): Output => {
    H.domain(
      stopWeights.length > 0 &&
        stopWeights.every((x) => x >= 0) &&
        stopWeights.reduce((a, b) => a + b, 0) > 0 &&
        totalRoundCost >= 0,
    );
    H.integer(stopIndex, 0, stopWeights.length - 1);
    return {
      weightTotal: stopWeights.reduce((a, b) => a + b, 0),
      allocatedCost:
        (totalRoundCost * stopWeights[stopIndex]) /
        stopWeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stopWeights: [1, 2, 3], totalRoundCost: 60, stopIndex: 1 },
  output: { weightTotal: 6, allocatedCost: 20 },
} satisfies ToolExample<Input, Output>;
export const communityPharmacyDeliveryRoundCostShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "community-pharmacy/community-pharmacy-delivery-round-cost-share",
      title: "Community Pharmacy Delivery Round Cost Share Tool",
      description:
        "Calculate community pharmacy delivery round cost share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stopWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          totalRoundCost: { type: "number", minimum: 0 },
          stopIndex: { type: "integer", minimum: 0 },
        },
        required: ["stopWeights", "totalRoundCost", "stopIndex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightTotal: { type: "number" },
          allocatedCost: { type: "number" },
        },
        required: ["weightTotal", "allocatedCost"],
      },
      ports: {
        inputs: [
          {
            id: "stopWeights",
            label: "Stop Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "totalRoundCost",
            label: "Total Round Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "stopIndex",
            label: "Stop Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "weightTotal",
            label: "Weight Total",
            valueType: { type: "number" },
          },
          {
            id: "allocatedCost",
            label: "Allocated Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communityPharmacyDeliveryRoundCostShareTool.execute;
export default communityPharmacyDeliveryRoundCostShareTool;
