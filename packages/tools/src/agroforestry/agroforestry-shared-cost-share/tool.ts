import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalSharedCost: number;
  readonly assignedWeight: number;
  readonly sumOfWeights: number;
};
export type Output = {
  readonly allocatedCost: number;
  readonly allocationFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSharedCost: { type: "number", minimum: 0 },
    assignedWeight: { type: "number", minimum: 0 },
    sumOfWeights: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalSharedCost", "assignedWeight", "sumOfWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedCost: { type: "number" },
    allocationFraction: { type: "number" },
  },
  required: ["allocatedCost", "allocationFraction"],
} as const;
/** Allocate an explicit shared cost using a supplied nonnegative weight share without selecting an allocation policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalSharedCost, assignedWeight, sumOfWeights } = request;
  const compute = (): Output => {
    H.domain(totalSharedCost >= 0 && assignedWeight >= 0, "totalSharedCost");
    (H.domain(sumOfWeights > 0, "sumOfWeights"), sumOfWeights);
    H.domain(assignedWeight <= sumOfWeights, "assignedWeight");
    return {
      allocatedCost: totalSharedCost * (assignedWeight / sumOfWeights),
      allocationFraction: assignedWeight / sumOfWeights,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalSharedCost: 1000, assignedWeight: 3, sumOfWeights: 10 },
  output: { allocatedCost: 300, allocationFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const agroforestrySharedCostShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["agroforestry", "agriculture"],
      keywords: ["agroforestry", "agriculture"],
    },
    id: "agroforestry/agroforestry-shared-cost-share",
    title: "Agroforestry Shared Cost Share",
    description:
      "Allocate an explicit shared cost using a supplied nonnegative weight share without selecting an allocation policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSharedCost: { type: "number", minimum: 0 },
        assignedWeight: { type: "number", minimum: 0 },
        sumOfWeights: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["totalSharedCost", "assignedWeight", "sumOfWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedCost: { type: "number" },
        allocationFraction: { type: "number" },
      },
      required: ["allocatedCost", "allocationFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalSharedCost",
          label: "Total Shared Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assignedWeight",
          label: "Assigned Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sumOfWeights",
          label: "Sum Of Weights",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedCost",
          label: "Allocated Cost",
          valueType: { type: "number" },
        },
        {
          id: "allocationFraction",
          label: "Allocation Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agroforestrySharedCostShareTool.execute;
export default agroforestrySharedCostShareTool;
