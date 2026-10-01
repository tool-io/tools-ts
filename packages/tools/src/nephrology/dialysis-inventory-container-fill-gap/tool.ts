import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerCapacity: number;
  readonly deliveredVolumes: readonly number[];
  readonly openingVolume: number;
  readonly withdrawal: number;
};
export type Output = {
  readonly availableVolume: number;
  readonly endingVolume: number;
  readonly freeCapacity: number;
  readonly overflow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerCapacity: { type: "number", minimum: 0 },
    deliveredVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    openingVolume: { type: "number", minimum: 0 },
    withdrawal: { type: "number", minimum: 0 },
  },
  required: [
    "containerCapacity",
    "deliveredVolumes",
    "openingVolume",
    "withdrawal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableVolume: { type: "number" },
    endingVolume: { type: "number" },
    freeCapacity: { type: "number" },
    overflow: { type: "number" },
  },
  required: ["availableVolume", "endingVolume", "freeCapacity", "overflow"],
} as const;
/** Calculate dialysis inventory container fill gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerCapacity, deliveredVolumes, openingVolume, withdrawal } =
    request;
  const compute = (): Output => {
    H.domain(
      containerCapacity >= 0 &&
        openingVolume >= 0 &&
        deliveredVolumes.every((x) => x >= 0) &&
        withdrawal >= 0 &&
        withdrawal <=
          openingVolume + deliveredVolumes.reduce((a, b) => a + b, 0),
    );
    return {
      availableVolume:
        openingVolume + deliveredVolumes.reduce((a, b) => a + b, 0),
      endingVolume:
        openingVolume +
        deliveredVolumes.reduce((a, b) => a + b, 0) -
        withdrawal,
      freeCapacity:
        containerCapacity -
        openingVolume -
        deliveredVolumes.reduce((a, b) => a + b, 0) +
        withdrawal,
      overflow: Math.max(
        0,
        openingVolume +
          deliveredVolumes.reduce((a, b) => a + b, 0) -
          withdrawal -
          containerCapacity,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    containerCapacity: 100,
    deliveredVolumes: [20, 30],
    openingVolume: 40,
    withdrawal: 10,
  },
  output: {
    availableVolume: 90,
    endingVolume: 80,
    freeCapacity: 20,
    overflow: 0,
  },
} satisfies ToolExample<Input, Output>;
export const dialysisInventoryContainerFillGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/dialysis-inventory-container-fill-gap",
    title: "Dialysis Inventory Container Fill Gap Tool",
    description:
      "Calculate dialysis inventory container fill gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerCapacity: { type: "number", minimum: 0 },
        deliveredVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        openingVolume: { type: "number", minimum: 0 },
        withdrawal: { type: "number", minimum: 0 },
      },
      required: [
        "containerCapacity",
        "deliveredVolumes",
        "openingVolume",
        "withdrawal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableVolume: { type: "number" },
        endingVolume: { type: "number" },
        freeCapacity: { type: "number" },
        overflow: { type: "number" },
      },
      required: ["availableVolume", "endingVolume", "freeCapacity", "overflow"],
    },
    ports: {
      inputs: [
        {
          id: "containerCapacity",
          label: "Container Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveredVolumes",
          label: "Delivered Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "openingVolume",
          label: "Opening Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrawal",
          label: "Withdrawal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableVolume",
          label: "Available Volume",
          valueType: { type: "number" },
        },
        {
          id: "endingVolume",
          label: "Ending Volume",
          valueType: { type: "number" },
        },
        {
          id: "freeCapacity",
          label: "Free Capacity",
          valueType: { type: "number" },
        },
        { id: "overflow", label: "Overflow", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dialysisInventoryContainerFillGapTool.execute;
export default dialysisInventoryContainerFillGapTool;
