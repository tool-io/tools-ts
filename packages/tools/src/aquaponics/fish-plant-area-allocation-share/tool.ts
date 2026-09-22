import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fishArea: number;
  readonly plantArea: number;
  readonly sharedArea: number;
  readonly splitSharedEqually: boolean;
};
export type Output = {
  readonly uniqueArea: number;
  readonly fishAllocated: number;
  readonly plantAllocated: number;
  readonly plantShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fishArea: { type: "number", minimum: 0 },
    plantArea: { type: "number", minimum: 0 },
    sharedArea: { type: "number", minimum: 0 },
    splitSharedEqually: { type: "boolean" },
  },
  required: ["fishArea", "plantArea", "sharedArea", "splitSharedEqually"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueArea: { type: "number" },
    fishAllocated: { type: "number" },
    plantAllocated: { type: "number" },
    plantShare: { type: "number" },
  },
  required: ["uniqueArea", "fishAllocated", "plantAllocated", "plantShare"],
} as const;
/** Allocate supplied shared floor area under an explicit split convention without system sizing or husbandry advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fishArea, plantArea, sharedArea, splitSharedEqually } = request;
  const compute = (): Output => {
    H.domain(
      fishArea >= 0 &&
        plantArea >= 0 &&
        sharedArea >= 0 &&
        sharedArea <= Math.min(fishArea, plantArea) &&
        fishArea + plantArea > sharedArea,
    );
    return {
      uniqueArea: fishArea + plantArea - sharedArea,
      fishAllocated: fishArea - (splitSharedEqually ? sharedArea / 2 : 0),
      plantAllocated:
        plantArea - (splitSharedEqually ? sharedArea / 2 : sharedArea),
      plantShare:
        (plantArea - (splitSharedEqually ? sharedArea / 2 : sharedArea)) /
        (fishArea + plantArea - sharedArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fishArea: 40,
    plantArea: 60,
    sharedArea: 20,
    splitSharedEqually: true,
  },
  output: {
    uniqueArea: 80,
    fishAllocated: 30,
    plantAllocated: 50,
    plantShare: 0.625,
  },
} satisfies ToolExample<Input, Output>;
export const fishPlantAreaAllocationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/fish-plant-area-allocation-share",
    title: "Fish Plant Area Allocation Share Tool",
    description:
      "Allocate supplied shared floor area under an explicit split convention without system sizing or husbandry advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fishArea: { type: "number", minimum: 0 },
        plantArea: { type: "number", minimum: 0 },
        sharedArea: { type: "number", minimum: 0 },
        splitSharedEqually: { type: "boolean" },
      },
      required: ["fishArea", "plantArea", "sharedArea", "splitSharedEqually"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueArea: { type: "number" },
        fishAllocated: { type: "number" },
        plantAllocated: { type: "number" },
        plantShare: { type: "number" },
      },
      required: ["uniqueArea", "fishAllocated", "plantAllocated", "plantShare"],
    },
    ports: {
      inputs: [
        {
          id: "fishArea",
          label: "Fish Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plantArea",
          label: "Plant Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedArea",
          label: "Shared Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "splitSharedEqually",
          label: "Split Shared Equally",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "uniqueArea",
          label: "Unique Area",
          valueType: { type: "number" },
        },
        {
          id: "fishAllocated",
          label: "Fish Allocated",
          valueType: { type: "number" },
        },
        {
          id: "plantAllocated",
          label: "Plant Allocated",
          valueType: { type: "number" },
        },
        {
          id: "plantShare",
          label: "Plant Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishPlantAreaAllocationShareTool.execute;
export default fishPlantAreaAllocationShareTool;
