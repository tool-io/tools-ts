import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalInventory: number;
  readonly coproductWeight: number;
  readonly totalWeights: number;
};
export type Output = {
  readonly allocatedInventory: number;
  readonly allocationShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalInventory: { type: "number" },
    coproductWeight: { type: "number", minimum: 0 },
    totalWeights: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalInventory", "coproductWeight", "totalWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedInventory: { type: "number" },
    allocationShare: { type: "number" },
  },
  required: ["allocatedInventory", "allocationShare"],
} as const;
/** Allocate an explicit signed emission inventory by a supplied nonnegative coproduct weight share without selecting an allocation method. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalInventory, coproductWeight, totalWeights } = request;
  const compute = (): Output => {
    H.domain(coproductWeight >= 0, "coproductWeight");
    (H.domain(
      Number.isFinite(totalWeights) && totalWeights > 0,
      "totalWeights",
    ),
      totalWeights);
    H.domain(coproductWeight <= totalWeights, "coproductWeight");
    return {
      allocatedInventory: totalInventory * (coproductWeight / totalWeights),
      allocationShare: coproductWeight / totalWeights,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalInventory: 1000, coproductWeight: 3, totalWeights: 10 },
  output: { allocatedInventory: 300, allocationShare: 0.3 },
} satisfies ToolExample<Input, Output>;
export const emissionAllocationSingleCoproductShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "environmental-science",
          "environmental science",
          "earth and environmental sciences",
        ],
        keywords: ["environmental science", "earth and environmental sciences"],
      },
      id: "environmental-science/emission-allocation-single-coproduct-share",
      title: "Emission Allocation Single Coproduct Share",
      description:
        "Allocate an explicit signed emission inventory by a supplied nonnegative coproduct weight share without selecting an allocation method.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalInventory: { type: "number" },
          coproductWeight: { type: "number", minimum: 0 },
          totalWeights: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["totalInventory", "coproductWeight", "totalWeights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allocatedInventory: { type: "number" },
          allocationShare: { type: "number" },
        },
        required: ["allocatedInventory", "allocationShare"],
      },
      ports: {
        inputs: [
          {
            id: "totalInventory",
            label: "Total Inventory",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coproductWeight",
            label: "Coproduct Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalWeights",
            label: "Total Weights",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "allocatedInventory",
            label: "Allocated Inventory",
            valueType: { type: "number" },
          },
          {
            id: "allocationShare",
            label: "Allocation Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = emissionAllocationSingleCoproductShareTool.execute;
export default emissionAllocationSingleCoproductShareTool;
