import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly binSlots: number;
  readonly unitsPerSlot: number;
  readonly occupiedSlots: number;
  readonly looseUnits: number;
  readonly incoming: number;
};
export type Output = {
  readonly freeCapacity: number;
  readonly fits: boolean;
  readonly overflow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binSlots: { type: "integer", minimum: 0 },
    unitsPerSlot: { type: "integer", minimum: 1 },
    occupiedSlots: { type: "integer", minimum: 0 },
    looseUnits: { type: "integer", minimum: 0 },
    incoming: { type: "integer", minimum: 0 },
  },
  required: [
    "binSlots",
    "unitsPerSlot",
    "occupiedSlots",
    "looseUnits",
    "incoming",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeCapacity: { type: "integer" },
    fits: { type: "boolean" },
    overflow: { type: "integer" },
  },
  required: ["freeCapacity", "fits", "overflow"],
} as const;
/** Calculate pharmacy robot bin fill capacity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { binSlots, unitsPerSlot, occupiedSlots, looseUnits, incoming } =
    request;
  const compute = (): Output => {
    H.integer(binSlots, 0);
    H.integer(unitsPerSlot, 1);
    H.integer(occupiedSlots, 0, binSlots);
    H.integer(looseUnits, 0);
    H.integer(incoming, 0);
    H.domain(looseUnits <= (binSlots - occupiedSlots) * unitsPerSlot);
    return {
      freeCapacity: (binSlots - occupiedSlots) * unitsPerSlot - looseUnits,
      fits: incoming <= (binSlots - occupiedSlots) * unitsPerSlot - looseUnits,
      overflow: Math.max(
        0,
        incoming - (binSlots - occupiedSlots) * unitsPerSlot + looseUnits,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    binSlots: 10,
    unitsPerSlot: 5,
    occupiedSlots: 6,
    looseUnits: 3,
    incoming: 20,
  },
  output: { freeCapacity: 17, fits: false, overflow: 3 },
} satisfies ToolExample<Input, Output>;
export const pharmacyRobotBinFillCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/pharmacy-robot-bin-fill-capacity",
    title: "Pharmacy Robot Bin Fill Capacity Tool",
    description:
      "Calculate pharmacy robot bin fill capacity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binSlots: { type: "integer", minimum: 0 },
        unitsPerSlot: { type: "integer", minimum: 1 },
        occupiedSlots: { type: "integer", minimum: 0 },
        looseUnits: { type: "integer", minimum: 0 },
        incoming: { type: "integer", minimum: 0 },
      },
      required: [
        "binSlots",
        "unitsPerSlot",
        "occupiedSlots",
        "looseUnits",
        "incoming",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freeCapacity: { type: "integer" },
        fits: { type: "boolean" },
        overflow: { type: "integer" },
      },
      required: ["freeCapacity", "fits", "overflow"],
    },
    ports: {
      inputs: [
        {
          id: "binSlots",
          label: "Bin Slots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerSlot",
          label: "Units Per Slot",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "occupiedSlots",
          label: "Occupied Slots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "looseUnits",
          label: "Loose Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "incoming",
          label: "Incoming",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "freeCapacity",
          label: "Free Capacity",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        { id: "overflow", label: "Overflow", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacyRobotBinFillCapacityTool.execute;
export default pharmacyRobotBinFillCapacityTool;
