import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalFlow: number;
  readonly fishBranchFlow: number;
  readonly plantBranchFlow: number;
  readonly sharedBranchFlow: number;
};
export type Output = {
  readonly uniqueAssignedFlow: number;
  readonly unassignedFlow: number;
  readonly plantShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFlow: { type: "number", minimum: 0 },
    fishBranchFlow: { type: "number", minimum: 0 },
    plantBranchFlow: { type: "number", minimum: 0 },
    sharedBranchFlow: { type: "number", minimum: 0 },
  },
  required: [
    "totalFlow",
    "fishBranchFlow",
    "plantBranchFlow",
    "sharedBranchFlow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueAssignedFlow: { type: "number" },
    unassignedFlow: { type: "number" },
    plantShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["uniqueAssignedFlow", "unassignedFlow", "plantShare", "defined"],
} as const;
/** Calculate fish plant flow branch share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalFlow, fishBranchFlow, plantBranchFlow, sharedBranchFlow } =
    request;
  const compute = (): Output => {
    H.domain(
      totalFlow >= 0 &&
        fishBranchFlow >= 0 &&
        plantBranchFlow >= 0 &&
        sharedBranchFlow >= 0 &&
        sharedBranchFlow <= Math.min(fishBranchFlow, plantBranchFlow) &&
        fishBranchFlow + plantBranchFlow - sharedBranchFlow <= totalFlow,
    );
    return {
      uniqueAssignedFlow: fishBranchFlow + plantBranchFlow - sharedBranchFlow,
      unassignedFlow:
        totalFlow - fishBranchFlow - plantBranchFlow + sharedBranchFlow,
      plantShare: totalFlow > 0 ? plantBranchFlow / totalFlow : 0,
      defined: totalFlow > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalFlow: 100,
    fishBranchFlow: 60,
    plantBranchFlow: 50,
    sharedBranchFlow: 20,
  },
  output: {
    uniqueAssignedFlow: 90,
    unassignedFlow: 10,
    plantShare: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const fishPlantFlowBranchShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/fish-plant-flow-branch-share",
    title: "Fish Plant Flow Branch Share Tool",
    description:
      "Calculate fish plant flow branch share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFlow: { type: "number", minimum: 0 },
        fishBranchFlow: { type: "number", minimum: 0 },
        plantBranchFlow: { type: "number", minimum: 0 },
        sharedBranchFlow: { type: "number", minimum: 0 },
      },
      required: [
        "totalFlow",
        "fishBranchFlow",
        "plantBranchFlow",
        "sharedBranchFlow",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueAssignedFlow: { type: "number" },
        unassignedFlow: { type: "number" },
        plantShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "uniqueAssignedFlow",
        "unassignedFlow",
        "plantShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "totalFlow",
          label: "Total Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fishBranchFlow",
          label: "Fish Branch Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plantBranchFlow",
          label: "Plant Branch Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedBranchFlow",
          label: "Shared Branch Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueAssignedFlow",
          label: "Unique Assigned Flow",
          valueType: { type: "number" },
        },
        {
          id: "unassignedFlow",
          label: "Unassigned Flow",
          valueType: { type: "number" },
        },
        {
          id: "plantShare",
          label: "Plant Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = fishPlantFlowBranchShareTool.execute;
export default fishPlantFlowBranchShareTool;
