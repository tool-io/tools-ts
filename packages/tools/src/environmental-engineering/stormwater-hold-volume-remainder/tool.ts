import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inflowVolume: number;
  readonly existingStored: number;
  readonly discharged: number;
  readonly capacity: number;
};
export type Output = {
  readonly endingStored: number;
  readonly remainingCapacity: number;
  readonly overflow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inflowVolume: { type: "number", minimum: 0 },
    existingStored: { type: "number", minimum: 0 },
    discharged: { type: "number", minimum: 0 },
    capacity: { type: "number", minimum: 0 },
  },
  required: ["inflowVolume", "existingStored", "discharged", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endingStored: { type: "number" },
    remainingCapacity: { type: "number" },
    overflow: { type: "number" },
  },
  required: ["endingStored", "remainingCapacity", "overflow"],
} as const;
/** Calculate stormwater hold volume remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inflowVolume, existingStored, discharged, capacity } = request;
  const compute = (): Output => {
    H.domain(
      inflowVolume >= 0 &&
        existingStored >= 0 &&
        discharged >= 0 &&
        discharged <= existingStored + inflowVolume &&
        capacity >= 0,
    );
    return {
      endingStored: existingStored + inflowVolume - discharged,
      remainingCapacity: capacity - existingStored - inflowVolume + discharged,
      overflow: Math.max(
        0,
        existingStored + inflowVolume - discharged - capacity,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inflowVolume: 100,
    existingStored: 20,
    discharged: 50,
    capacity: 80,
  },
  output: { endingStored: 70, remainingCapacity: 10, overflow: 0 },
} satisfies ToolExample<Input, Output>;
export const stormwaterHoldVolumeRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/stormwater-hold-volume-remainder",
    title: "Stormwater Hold Volume Remainder Tool",
    description:
      "Calculate stormwater hold volume remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inflowVolume: { type: "number", minimum: 0 },
        existingStored: { type: "number", minimum: 0 },
        discharged: { type: "number", minimum: 0 },
        capacity: { type: "number", minimum: 0 },
      },
      required: ["inflowVolume", "existingStored", "discharged", "capacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endingStored: { type: "number" },
        remainingCapacity: { type: "number" },
        overflow: { type: "number" },
      },
      required: ["endingStored", "remainingCapacity", "overflow"],
    },
    ports: {
      inputs: [
        {
          id: "inflowVolume",
          label: "Inflow Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "existingStored",
          label: "Existing Stored",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discharged",
          label: "Discharged",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "endingStored",
          label: "Ending Stored",
          valueType: { type: "number" },
        },
        {
          id: "remainingCapacity",
          label: "Remaining Capacity",
          valueType: { type: "number" },
        },
        { id: "overflow", label: "Overflow", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stormwaterHoldVolumeRemainderTool.execute;
export default stormwaterHoldVolumeRemainderTool;
